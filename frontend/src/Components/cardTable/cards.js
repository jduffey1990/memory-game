import { useState } from 'react';
import Card from './card';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function Cards({ deck, matchedPairs, setMatchedPairs, onCardMatch, deckName }) {

    const [shuffledCards, setShuffledCards] = useState(() => shuffleArray([...deck]));
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);

    const handleCardFlip = (index) => {
        // Check if the card is already flipped, matched, or if there are already two guessed cards
        if (flippedCards.includes(index) || matchedCards.includes(index) || flippedCards.length === 2) return;
    
        const newFlipped = [...flippedCards, index];
        
        // If a card is already flipped and it's the same as the current card, do nothing
        if (flippedCards.length === 1 && newFlipped[0] === newFlipped[1]) return;
        
        setFlippedCards(newFlipped);
    
        // If 2 cards have been flipped
        if (newFlipped.length === 2) {
            const [firstIndex, secondIndex] = newFlipped;
            
            // Check if the images of the flipped cards match
            if (shuffledCards[firstIndex] === shuffledCards[secondIndex]) {
                // Add the indices to the matchedCards array
                setMatchedPairs(prevMatched => [...prevMatched, firstIndex, secondIndex]);
                onCardMatch(true)
                
                // Clear the flipped cards array
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    // Reset the flipped cards
                    setFlippedCards([]);
                    onCardMatch(false)
                }, 2000);
            }
        }
    }

    return (
        <div className="cards-container">
            {shuffledCards.map((img, index) => (
                <Card 
                    key={index}
                    front={img}
                    deckName={deckName}
                    // A card is flipped if it's in flippedCards or matchedCards arrays
                    isFlipped={flippedCards.includes(index) || matchedPairs.includes(index)}
                    onFlip={() => handleCardFlip(index)}
                />
            ))}
        </div>
    );
}

export default Cards;