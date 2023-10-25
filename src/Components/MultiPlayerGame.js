import React, { useState } from 'react';
import Cards from './cardTable/cards';
import { DECKS } from './cardTable/decks';

function MultiPlayerGame({ player1Score, player2Score }) {
    return (
      <div className="multiplayer-game">
        <div>Player 1 Score: {player1Score} Player 2 Score: {player2Score}</div>
      </div>
    );
  }

export default MultiPlayerGame;