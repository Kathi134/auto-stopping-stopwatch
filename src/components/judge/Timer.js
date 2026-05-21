
import React, { useState, useEffect } from "react";
import { displayFromMillis } from '../../utils/timeUtils';

const states = { "running": 0, "finished": 1 }

const Timer = ({ mode, initBeginningTime = 0, onClick }) => {
    const [beginningTime, setBeginningTime] = useState(initBeginningTime);
    const [time, setTime] = useState(0);
    const [state, setState] = useState(states.running);

    // TODO: wenn coming from puzzle chess tournament and it's already ended, 
    // but the other modes haven't, sometimes it remains ended after change

    useEffect(() => {
        setBeginningTime(initBeginningTime);
        // console.log("new beginning time")
    }, [initBeginningTime])

    useEffect(() => {
        setTime(0);
        setState(states.running)
        // console.log("new mode")
    }, [mode])

    useEffect(() => {
        // console.log("effect", time, mode.maximumTime)
        if (time >= mode.maximumTime) {
            // console.log("mode ending")
            setState(states.finished);
            setTime(mode.maximumTime);
        }

        let intervalId;
        if (state === states.running) {
            intervalId = setInterval(() => setTime(new Date() - beginningTime), 10);
            // console.log("recalc")
        }
        return () => clearInterval(intervalId);
    }, [state, time, setTime, mode.maximumTime, beginningTime]);


    return (<div>
        <div className="stopwatch-judge" onClick={() => onClick(time)}>
            {displayFromMillis(time)}
        </div>
        {
            state !== states.finished
                ? <div>Ende: {displayFromMillis(mode.maximumTime)}</div>
                : <div>{mode.name} beendet</div>
        }
    </div >
    );
};

export default Timer;
