import React, { useState, useEffect } from "react";
import { displayFromMillis } from "../../utils/timeUtils";

const states = { running: 0, finished: 1 };

const Timer = ({ mode, initBeginningTime = 0, onClick }) => {
    const [time, setTime] = useState(0);
    const [state, setState] = useState(states.running);

    // Reset whenever mode OR start time changes
    useEffect(() => {
        setState(states.running);
        setTime(Math.max(0, new Date() - initBeginningTime));
    }, [mode.id, initBeginningTime]);

    // Run interval only while timer is active
    useEffect(() => {
        if (state !== states.running) return;

        const intervalId = setInterval(() => {
            const newTime = new Date() - initBeginningTime;

            if (newTime >= mode.maximumTime) {
                setTime(mode.maximumTime);
                setState(states.finished);
                clearInterval(intervalId);
            } else {
                setTime(newTime);
            }
        }, 10);

        return () => clearInterval(intervalId);
    }, [state, initBeginningTime, mode.maximumTime]);

    return (
        <div>
            <div className="stopwatch-judge" onClick={() => onClick(time)}>
                {displayFromMillis(time)}
            </div>

            {state !== states.finished
                ? <div>Ende: {displayFromMillis(mode.maximumTime)}</div>
                : <div>{mode.name} beendet</div>}
        </div>
    );
};

export default Timer;