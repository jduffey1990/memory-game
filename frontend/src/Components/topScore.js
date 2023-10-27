import React from 'react';

const ScoreBoard = ({ scores = [] }) => {
  return (
    <div className="scoreboard">
      <ul className="score-list">
        {scores.map((score, idx) => (
          <li key={idx} className="score-item">
            {score.first_name} {score.last_name} - {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;