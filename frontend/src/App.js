import React, {useState, useEffect} from 'react';

import './App.css';
import Cards from './Components/cardTable/cards'
import felt from './images/felt.png';
import { DECKS } from './Components/cardTable/decks'; 
import Timer from './Components/Timer/timer';
import MultiPlayerGame from './Components/MultiPlayerGame';
import ScoreBoard from './Components/topScore';
import SafeInput from './Components/safeInput';
import { BeatLoader } from 'react-spinners';

import { createScore } from './api'
import { listScores } from './api';
import { pingBackend } from './api';

function App() {
  
  //in game states
  const [gameType, setGameType] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState("Black and White");
  
  //in-game states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  
  //endgame states
  const [gameOver, setGameOver] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isFirstNameInappropriate, setIsFirstNameInappropriate] = useState(false);
  const [isLastNameInappropriate, setIsLastNameInappropriate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
  const statusMessages = ["Submitting...", "Saving your score...", "Almost there..."];

  //once we have retrieved the top scores from the DB
  const [topScores, setTopScores] = useState([]);
  const [showScores, setShowScores] = useState(false);

  // backend readiness
  const [backendReady, setBackendReady] = useState(false);
  const [backendWaking, setBackendWaking] = useState(true);

  // Poll the backend on mount until it responds or we give up (~75 seconds)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;
    let timeoutId = null;

    const tryPing = async () => {
      try {
        await pingBackend();
        setBackendReady(true);
        setBackendWaking(false);
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          timeoutId = setTimeout(tryPing, 5000);
        } else {
          // Give up after ~75 seconds; let the user try submitting and surface the error naturally
          setBackendWaking(false);
        }
      }
    };

    tryPing();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleGameTypeSelection = (type, deck) => {
    setGameType(type);
    setSelectedDeck(deck);

    if (type === 'single') {
      setIsTimerRunning(true);
    }
  }

  const handleCardMatch = (isMatched) => {
    if (gameType === 'multi') {
      if (isMatched) {
        if (playerTurn === 1) {
          setPlayer1Score(player1Score + 1);
        } else {
          setPlayer2Score(player2Score + 1);
        }
      } else {
        if (playerTurn === 1) {
          setPlayerTurn(2);
        } else {
          setPlayerTurn(1);
        }
      }
    }
  }

  //endgame effect
  useEffect(() => {
    if (matchedPairs.length === 18) {
        setIsTimerRunning(false);
        setGameOver(true);
    }
  }, [matchedPairs]);

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setStatusMessageIndex((prevIndex) => (prevIndex + 1) % statusMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSubmitting]);

  const handleFirstNameChange = (newVal) => {
    setFirstName(newVal);
  };

  const handleLastNameChange = (newVal) => {
    setLastName(newVal);
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const scoreData = {
        first_name: firstName,
        last_name: lastName,
        score: finalTime
      };

      const response = await createScore(scoreData);

      if (response) {
        const scores = await listScores();
        setTopScores(scores);
        setShowScores(true);
        setIsSubmitting(false);
      } else {
        console.error("Failed to submit score.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <h1>Jordan's Memory Game!</h1>

      {gameType === null && (
        <div className="game-choice-overlay">
          <div className="overlay-header">
            <h2>For best results, play on desktop, laptop, or tablet</h2>
          </div>

          <div className="deck-selector">
            <label>Select a deck: </label>
            <select value={selectedDeck} onChange={e => setSelectedDeck(e.target.value)}>
              {Object.keys(DECKS).map(deckKey => (
                <option key={deckKey} value={deckKey}>
                  {deckKey.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="mode-section">
            <div className="mode-card">
              <h2>1 Player</h2>
              <p>Race against the clock and climb the leaderboard!</p>
              <button onClick={() => handleGameTypeSelection('single', selectedDeck)}>
                Start Solo Game
              </button>
            </div>
            <div className="mode-divider">VS</div>
            <div className="mode-card">
              <h2>2 Players</h2>
              <p>Challenge a friend head-to-head for most matches!</p>
              <button className="button secondary" onClick={() => handleGameTypeSelection('multi', selectedDeck)}>
                Start 2 Player Game
              </button>
            </div>
          </div>

          {/* Subtle server status — only visible while waking up */}
          {backendWaking && !backendReady && (
            <div className="server-status">
              <BeatLoader size={6} color="#9FBFAD" loading={true} />
              <span>Warming up the server&hellip;</span>
            </div>
          )}
          {backendReady && (
            <div className="server-status server-ready">
              <span>&#10003; Server ready</span>
            </div>
          )}
        </div>
      )}

      {gameType && (
        <div className="game-container">
          <div className="board" style={{ backgroundImage: `url(${felt})` }}>
            <div className="game-info">
              {gameType === 'single' && (
                <Timer
                  isRunning={isTimerRunning}
                  matchedPairs={matchedPairs.length / 2}  
                  onStart={() => setIsTimerRunning(true)}
                  onStop={(time) => {
                    setIsTimerRunning(false);
                    setFinalTime(time);
                  }}
                />
              )}
              {gameType === 'multi' && !gameOver && (
                <div 
                  className={playerTurn === 1 ? "player-turn player1" : "player-turn"}
                  style={playerTurn === 1 ? {color: "#1910a0"} : {}}
                >
                  Player {playerTurn}'s Turn
                </div>
              )}
              {gameType === 'multi' && (
                <MultiPlayerGame player1Score={player1Score} player2Score={player2Score} />
              )}
            </div>

            <Cards 
              deck={DECKS[selectedDeck]} 
              setMatchedPairs={setMatchedPairs} 
              matchedPairs={matchedPairs}
              onCardMatch={handleCardMatch}
            />

            {gameOver && gameType === 'multi' && (
              <div className="game-result-overlay">
                <div className="result-text">
                  {player1Score === player2Score ? "It's a Tie!" :
                    player1Score > player2Score ? "Congrats Player 1!" : "Congrats Player 2!"}
                </div>
                <button className="button secondary" onClick={() => window.location.reload()}>
                  Restart
                </button>
              </div>
            )}

            {gameOver && gameType === 'single' && !showScores && (
              <div className="game-result-overlay">
                <div className="result-text">
                  <span className="time-label">Your Time</span>
                  <span className="time-value">{finalTime}s</span>
                </div>

                {/* Gate the form behind backend readiness */}
                {!backendReady ? (
                  <div className="server-waking-message">
                    <BeatLoader size={10} color="#FF8A8A" loading={true} />
                    <p>Server is warming up — score submission will be ready shortly!</p>
                  </div>
                ) : (
                  <form onSubmit={handleScoreSubmit} className="score-form">
                    <SafeInput 
                      type="text" 
                      placeholder="First Name" 
                      value={firstName} 
                      onInappropriatenessChange={(isInvalid) => setIsFirstNameInappropriate(isInvalid)}
                      onChange={handleFirstNameChange}
                    />
                    <SafeInput 
                      type="text" 
                      placeholder="Last Name" 
                      value={lastName} 
                      onInappropriatenessChange={(isInvalid) => setIsLastNameInappropriate(isInvalid)}
                      onChange={handleLastNameChange}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || isFirstNameInappropriate || isLastNameInappropriate}
                    >
                      {isSubmitting ? (
                        <>
                          <BeatLoader size={10} color="#fff" loading={isSubmitting} />
                          {statusMessages[statusMessageIndex]}
                        </>
                      ) : 'Submit Score'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {showScores && (
              <div className="game-result-overlay">
                <h1>Top Scores!</h1>
                <ScoreBoard scores={topScores} />
                <button className='button secondary' onClick={handleRestart}>Play Again</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;