
import React, { useState, useEffect } from "react";
import ModeSelector from './ModeSelector';
import { useMode } from "../context/ModeContext";
import { displayFromMillis } from '../utils/timeUtils';
import { useSettings } from "../context/SettingsContext";

const states = {"running":0, "finished":1, "paused":2, "zero":3}

const Stopwatch = () => {
    const {mode} = useMode();
    const {settings} = useSettings();
    const [beginningTime, setBeginningTime] = useState(0);
    const [time, setTime] = useState(0);
    const [state, setState] = useState(states.zero);

    useEffect(() => {
        if(time >= mode.maximumTime) {
            setState(states.finished);
        }

        let intervalId;
        if (state === states.running) {
            intervalId = setInterval(() => setTime(new Date() - beginningTime), 10);
        }
        return () => clearInterval(intervalId);
    }, [state, time, mode.maximumTime, beginningTime]);

    const startAndStop = () => {
        if(state === states.running) 
            setState(states.paused)
        else if(state === states.zero) {
            setState(states.running)
            setBeginningTime(new Date())
        }
        else if(state === states.paused) {
            setState(states.running)
            setBeginningTime(new Date() - time)
        }
    };
    const reset = () => {
        setTime(0);
        setState(states.zero);
    };

    return (
        <>
            <div className="stopwatch-time-container">
                <div className="stopwatch-time">
                    {displayFromMillis(time)}
                </div>
                {state !== states.finished 
                    ? <div className="stopwatch-end">Ende: {displayFromMillis(mode.maximumTime)}</div> 
                    : <div>{mode.name} beendet</div>}
            </div>
            
            {settings.showOptionsMenu ? <div className="options-menu">
                <div className="stopwatch-buttons">
                    {state !== states.finished ?
                    <button className="stopwatch-button" onClick={startAndStop}>
                        { state === states.running ? "Pause" 
                        : state === states.paused ? "Resume"
                        : "Start"}
                    </button> : null}
                    <button className="stopwatch-button" onClick={reset}>
                        Reset
                    </button>
                </div>
                {state === states.zero ? <ModeSelector/> : null}
            </div> : null}
            
        </>
    );
};

export default Stopwatch;
