import { useCallback, useEffect, useState } from "react";
import MODES from "../../model/modes";
import { getCompetitonStart, getCompetitorsForCompetition, postCompetitionResult } from "../../utils/api";
import Timer from "./Timer";
import { displayFromMillis } from "../../utils/timeUtils";

const undefinedTable = -1;
const undefinedId = -1;
const undefinedPosition = -1;
const undefinedName = "Nicht zugeordnet."

export default function JudgePage({ foo }) {
    const [competitors, setCompetitors] = useState([]);

    const [mode, setMode] = useState(MODES[0]);
    const [startingTime, setStartingTime] = useState(0);

    const [pendingResults, setPendingResults] = useState([]);
    const [ctr, setCtr] = useState(0);

    // debufg
    useEffect(() => {
        // console.log(pendingResults);
    }, [pendingResults])

    // init starting time and competitorList wrt selected comp
    useEffect(() => {
        console.log("updating mode")
        getCompetitonStart({ id: mode.id })
            .then(x => setStartingTime(new Date(x?.starting_time)));
        getCompetitorsForCompetition({ competitionId: mode.id })
            .then(x => setCompetitors(x.competitors));
    }, [mode.id])

    // new result
    const addResultToPending = useCallback((time) => {
        setPendingResults(prev => [...prev, {
            id: ctr,
            time: time,
            position: undefinedPosition,
            table: undefinedTable,
            competitorName: undefinedName,
            competitorId: undefinedId
        }]);
        setCtr(prev => prev + 1);
    }, [ctr]);

    // update table nr change -> filter competitor data
    const getCompetitorForTable = useCallback((table) => {
        return competitors.filter(x => x.table_nr === table)
            .map(x => {
                return {
                    id: x.id,
                    name: x.users.map(x => x.first_name + " " + x.last_name).join(", "),
                }
            })[0] ?? ({ name: undefinedName, competitorId: undefinedId });
    }, [competitors]);

    const setTableAtIdToValue = useCallback((id, value) => {
        setPendingResults(prev => {
            return prev?.map(x => {
                if (x.id === id) {
                    const competitorData = getCompetitorForTable(value);
                    console.log(competitorData);
                    return { ...x, table: value, competitorName: competitorData?.name, competitorId: competitorData?.id };
                }
                return x;
            })
        });
    }, [getCompetitorForTable]);

    const setPositionAtIdToValue = useCallback((id, value) => {
        setPendingResults(prev => {
            return prev?.map(x => {
                if (x.id === id) {
                    return { ...x, position: value };
                }
                return x;
            })
        });
    }, []);

    // delete a pending result
    const deleteResult = useCallback((id) => {
        setPendingResults(prev => prev.filter(x => x.id !== id));
    }, []);

    // persist result data in backend
    const storeResult = useCallback((competitorId, time, position, id) => {
        postCompetitionResult({ competitorId, time })
            .then(x => {
                console.log(x);
                if (x.status === 200)
                    deleteResult(id);
                else
                    alert("could not store.");
            });
    }, [deleteResult]);

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
                    <tr><th>Zeit</th><th>Tisch</th><th>Name</th><th>💾</th><th>🗑️</th></tr>
                </thead>
                <tbody>
                    {pendingResults?.map((x) =>
                        <tr key={x.id}>
                            <td>{displayFromMillis(x.time)}</td>
                            <td><input name="table-nr" className="small-input" type="number" value={x.table} onChange={e => setTableAtIdToValue(x.id, Number(e.target.value))} /></td>
                            <td className="bottom-border">{x.competitorName}</td>
                            <td><input name="position" className="small-input" type="number" value={x.position} onChange={e => setPositionAtIdToValue(x.id, Number(e.target.value))} /></td>
                            <td><button disabled={x.table === undefinedTable} onClick={() => storeResult(x.competitorId, x.time, x.position, x.id)}>💾</button></td>
                            <td><button onClick={() => deleteResult(x.id)}>🗑️</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>)
}