import React, {useState, useEffect} from 'react';

import './App.css';
import Cards from './Components/cardTable/cards'
import felt from './images/felt.png';
import { DECKS } from './Components/cardTable/decks'; 
import Timer from './Components/Timer/timer';
import MultiPlayerGame from './Components/MultiPlayerGame';

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
        
        // Set game over to true when all pairs are matched
        setGameOver(true);
    }
}, [matchedPairs]);

//single players submit their scores
const handleScoreSubmit = async (e) => {
  e.preventDefault();

  // Assuming you have a function or API setup to send data to your backend
  const response = await postScoreToBackend({
      firstName,
      lastName,
      time: finalTime,
  });

  if(response.success) {
      // Here you can switch to the overlay that shows top scores or handle any other post-submission behavior.
  } else {
      // Handle any errors
  }
};

  return (
    <div className="App">
      <h1>Jordan's Memory Game!</h1>

      //gane type select
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
          <button onClick={() => handleGameTypeSelection('single', selectedDeck)}>Start 1 Player Game</button>
          <button className="button secondary" onClick={() => handleGameTypeSelection('multi', selectedDeck)}>Start 2 Player Game</button>
        </div>
      )}

    {gameType && (
      <div className="game-container">
        <div className="board" style={{ backgroundImage: `url(${felt})` }}>
            <div className="game-info">
                {gameType === 'single' && (
                <Timer
                  isRunning={isTimerRunning}
                  matchedPairs={matchedPairs.length / 2}  // Assuming you'll pass this prop from the Cards component
                  onStart={() => setIsTimerRunning(true)}
                  onStop={(time) => {
                      setIsTimerRunning(false);
                      setFinalTime(time);
                      // TODO: Send the time to your backend for high score tracking
                  
                    }}
                    />
                )}
                {gameType === 'multi' && !gameOver && <div className="player-turn">Player {playerTurn}'s Turn</div>}
                {gameType === 'multi' && <MultiPlayerGame player1Score={player1Score} player2Score={player2Score} />}
            </div>
            <Cards 
                deck={DECKS[selectedDeck]} 
                setMatchedPairs={setMatchedPairs} 
                matchedPairs={matchedPairs}
                onCardMatch={handleCardMatch}
            />

            //multi-player game over restart?
            {gameOver && gameType === 'multi' && (
                <div className="game-result-overlay">
                    <div className="result-text">
                        {player1Score === player2Score ? "It's a Tie!" :
                        player1Score > player2Score ? "Congrats Player 1!" : "Congrats Player 2!"}
                    </div>
                    <button className="button.secondary" onClick={() => window.location.reload()}>Restart</button>
                </div>
            )}

            //single player game over score submit
            {gameOver && gameType === 'single' && (
                <div className="game-result-overlay">
                    <div className="result-text">Your Time: {finalTime}</div>
                    <form onSubmit={handleScoreSubmit}>
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <button type="submit">Submit Score</button>
                    </form>
                </div>
            )}
          </div>
        </div>
    )}

    </div>
);
}

export default App;
