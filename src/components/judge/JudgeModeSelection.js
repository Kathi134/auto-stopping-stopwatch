import MODES from "../../model/modes";
import { useState } from "react";

export default function JudgeModeSelection({ startingTime, mode, setMode }) {
    return (
        <span>
            <div className="center bottom-margin">
                <div className="secondary-text">Ergebniserfassung für Modus:</div>
                <div>
                    <select name="mode" onChange={(e) => setMode(JSON.parse(e.target.value))} value={JSON.stringify(mode)}>
                        {MODES.map(m => <option value={JSON.stringify(m)} key={m.name} >{m.name} (id: {m.id})</option>)}
                    </select>
                </div>

                <div className="secondary-text">gestartet: {startingTime.toLocaleString()}</div>
            </div>
        </span>
    )
}