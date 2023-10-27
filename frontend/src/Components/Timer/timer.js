import React, { useState, useEffect } from 'react';

function Timer({ onStart, onStop, isRunning, matchedPairs }) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (matchedPairs === 9) {
            onStop(seconds);  // Sending the elapsed time to the parent
        }
    }, [matchedPairs, onStop, seconds]);

    return <div id="timer">Timer: {seconds}</div>;
}

export default Timer;