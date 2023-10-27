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
            console.log("Timer Component - Matched Pairs:", matchedPairs);
            console.log("Timer Component - Seconds:", seconds);
            onStop(seconds);  // Sending the elapsed time to the parent
        }
    }, [matchedPairs, onStop]);

    return <div id="timer">Timer: {seconds}</div>;
}

export default Timer;