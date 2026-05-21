import { useCallback, useEffect, useState } from "react";
import MODES from "../../model/modes";
import { getCompetitorForTable, getCompetitonStart } from "../../utils/api";
import Timer from "./Timer";
import { displayFromMillis } from "../../utils/timeUtils";

const undefinedTable = -1;
const undefinedId = -1;
const undefinedName = "Nicht zugeordnet."

export default function JudgePage({ foo }) {
    const [mode, setMode] = useState(MODES[0]);
    const [startingTime, setStartingTime] = useState(0);
    const [pendingResults, setPendingResults] = useState([]);
    const [ctr, setCtr] = useState(0);

    // debufg
    useEffect(() => {
        console.log(pendingResults);
    }, [pendingResults])

    useEffect(() => {
        getCompetitonStart({ id: mode.id })
            .then(x => setStartingTime(new Date(x?.starting_time)));
    }, [mode])

    const addResultToPending = useCallback((time) => {
        setPendingResults(prev => [...prev, {
            id: ctr,
            time: time,
            table: undefinedTable,
            competitorName: undefinedName,
            competitorId: undefinedId
        }]);
        setCtr(prev => prev + 1);
    }, [ctr]);

    const updateResultForId = useCallback((res, id, tableNr) => {
        console.log(res, id, tableNr)
        setPendingResults(prev => {
            return prev?.map(x => {
                if (x.id === id)
                    return { ...x, table: tableNr, competitorName: res.name, competitorId: res.id };
                return x;
            })
        });
    }, []);

    const setTableAtIdToValue = useCallback((id, value) => {
        getCompetitorForTable({ competitionId: mode.id, table: value, id: id })
            .then(res => updateResultForId(res, id, value));
    }, [mode.id, updateResultForId]);

    const deleteResult = useCallback((id) => {
        setPendingResults(prev => prev.filter(x => x.id !== id));
    }, []);

    const storeResult = useCallback((id) => {
        // pendingResults[id].name = 
    }, []);

    return (<div>
        <h1 className="center">Ergebniserfassung</h1>

        <div className="center">
            <div>Ergebniserfassung für Modus:</div>
            <select name="mode" onChange={(e) => setMode(JSON.parse(e.target.value))} value={JSON.stringify(mode)}>
                {MODES.map(m => <option value={JSON.stringify(m)} key={m.name} >{m.name} (id: {m.id})</option>)}
            </select>

            <div>gestartet: {startingTime.toLocaleString()}</div>
        </div>

        <div>
            <div className="stopwatch-time-container">
                <span>Hier klicken, um eine Zeit zu erfassen:</span>
                <Timer mode={mode} initBeginningTime={startingTime} onClick={addResultToPending} />
            </div>
        </div>

        <div className="center">
            <span>Gesammelte Ergebnisse:</span>
            <table>
                <thead>
                    <tr><th>Zeit</th><th>Tisch</th><th>Name</th><th>Speichern</th><th>Löschen</th></tr>
                </thead>
                <tbody>
                    {pendingResults?.map((x) =>
                        <tr key={x.id}>
                            <td>{displayFromMillis(x.time)}</td>
                            <td><input className="small-input" type="number" value={x.table} onChange={e => setTableAtIdToValue(x.id, Number(e.target.value))} /></td>
                            <td className="bottom-border">{x.competitorName} ({x.competitorId})</td>
                            <td><button disabled={x.table === undefinedTable} onClick={() => storeResult(x.id)}>Speichern</button></td>
                            <td><button onClick={() => deleteResult(x.id)}>Löschen</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>)
}