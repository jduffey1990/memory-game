import React from 'react';

function MultiPlayerGame({ player1Score, player2Score }) {
    return (
      <div className="multiplayer-game">
        <div>Player 1 Score: {player1Score} Player 2 Score: {player2Score}</div>
      </div>
    );
  }

export default MultiPlayerGame;