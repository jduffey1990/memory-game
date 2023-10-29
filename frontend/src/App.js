import React, {useState, useEffect} from 'react';

import './App.css';
import Cards from './Components/cardTable/cards'
import felt from './images/felt.png';
import { DECKS } from './Components/cardTable/decks'; 
import Timer from './Components/Timer/timer';
import MultiPlayerGame from './Components/MultiPlayerGame';
import ScoreBoard from './Components/topScore';
import SafeInput from './Components/safeInput';

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

  //once we have retrieved the top scores from the DB
  const [topScores, setTopScores] = useState([]);
  const [showScores, setShowScores] = useState(false)

  

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

  useEffect(() => {
    (async () => {
      try {
        await pingBackend();
      } catch (error) {
        console.error('Failed to ping backend:', error);
      }
    })();
  }, []);

  //endgame effect
  useEffect(() => {
    if (matchedPairs.length === 18) {
        setIsTimerRunning(false);
        
        // Set game over to true when all pairs are matched
        setGameOver(true);
    }
}, [matchedPairs]);

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
    // Create a score object from your state values
    const scoreData = {
      first_name: firstName,
      last_name: lastName,
      score: finalTime
    };

    // Use the createScore function to send data to your backend
    const response = await createScore(scoreData);

    if (response) {
      const scores = await listScores();
      setTopScores(scores);
      setShowScores(true);  // Show the scores view
      setIsSubmitting(false);
    } else {
      // Handle failure: show a user-friendly error message
      console.error("Failed to submit score.");
      setIsSubmitting(false);
    }

  } catch (error) {
    // Handle error: show a user-friendly error message
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
          <div>
                <h2>For best results, play on desktop, laptop, or tablet</h2>
                </div>
                
          <h2>Choose Game Mode:</h2>
          <div style={{margin: "20px 0"}}>
                <label>Select a deck: </label>
                <select value={selectedDeck} onChange={e => setSelectedDeck(e.target.value)}>
                    {Object.keys(DECKS).map(deckKey => (
                        <option key={deckKey} value={deckKey}>
                            {deckKey.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h2>In a one player game, race against the clock to see if you can get a high score</h2>
                <button onClick={() => handleGameTypeSelection('single', selectedDeck)}>Start 1 Player Game</button>
                <h2>In a two player game, beat your friends and family head-to-head</h2>
                <button className="button secondary" onClick={() => handleGameTypeSelection('multi', selectedDeck)}>Start 2 Player Game</button>
            </div>
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
                {gameType === 'multi' && <MultiPlayerGame player1Score={player1Score} player2Score={player2Score} />}
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
                    <button className="button secondary" onClick={() => window.location.reload()}>Restart</button>
                </div>
            )}

            
              {gameOver && gameType === 'single' && !showScores && (
                  <div className="game-result-overlay">
                      <div className="result-text">Your Time: {finalTime} seconds</div>
                      <form onSubmit={handleScoreSubmit}>
                      <SafeInput 
                          type="text" 
                          placeholder="First Name" 
                          value={firstName} 
                          onInappropriatenessChange={(isInvalid) => {
                              setIsFirstNameInappropriate(isInvalid);
                          }}
                          onChange={handleFirstNameChange} // Pass the function here
                      />

                      <SafeInput 
                          type="text" 
                          placeholder="Last Name" 
                          value={lastName} 
                          onInappropriatenessChange={(isInvalid) => {
                              setIsLastNameInappropriate(isInvalid);
                          }}
                          onChange={handleLastNameChange} // Pass the function here
                      />
                          <button type="submit" disabled={isSubmitting || isFirstNameInappropriate || isLastNameInappropriate}>
                              {isSubmitting ? 'Submitting...' : 'Submit Score'}
                          </button>
                      </form>
                  </div>
              )}

            {showScores && (
                        <div className="game-result-overlay">
                            <h1>Top Scores!</h1>
                            <ScoreBoard scores={topScores} />
                            <button className ='button secondary' onClick={handleRestart}>Restart</button>
                        </div>
            )}
                
              ;
          </div>
        </div>
    )}

    </div>
);
            }


export default App;
