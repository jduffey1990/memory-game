import React from 'react';
import cardBackImage from "../../images/cardBack.png"; // Assuming you have a uniform back image for cards

function Card({ front, isFlipped, onFlip }) {
    return (
        <div className="card" onClick={onFlip}>
            <img src={isFlipped ? front : cardBackImage} alt="Card" />
        </div>
    );
}

export default Card;