import { useCallback, useEffect, useState } from "react";
import MODES from "../../model/modes";
import { getCompetitonStart, getCompetitorsForCompetition, postCompetitionResult, getCompetititonData } from "../../utils/api";
import Timer from "./Timer";
import { displayFromMillis } from "../../utils/timeUtils";

const undefinedTable = -1;
const undefinedId = -1;
const undefinedPosition = -1;
const undefinedName = "Nicht zugeordnet."

export default function JudgePage({ foo }) {
    const [competitors, setCompetitors] = useState([]);
    const [puzzles, setPuzzles] = useState([]);

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
        // getCompetitorsForCompetition({ competitionId: mode.id })
        //     .then(x => setCompetitors(x.competitors));
        getCompetititonData({ competitionId: mode.id })
            .then(x => {
                setPuzzles(x.puzzles);
                setCompetitors(x.competitors);
            });
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
                    return {
                        ...x,
                        position: value,
                        puzzleUrl: puzzles.find(x => x.position === value)?.image
                    };
                }
                return x;
            })
        });
    }, [puzzles]);

    // delete a pending result
    const deleteResult = useCallback((id) => {
        setPendingResults(prev => prev.filter(x => x.id !== id));
    }, []);

    // edit a pending result
    const increaseTime = useCallback((id) => {
        setPendingResults(prev => prev.map(x => {
            return { ...x, time: x.id === id ? x.time + 500 : x.time }
        }));
    }, []);

    const decreaseTime = useCallback((id) => {
        setPendingResults(prev => prev.map(x => {
            return { ...x, time: x.id === id ? x.time - 500 : x.time }
        }));
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
                <tbody>
                    {pendingResults?.map((x) =>
                        <tr key={x.id}>
                            <td><div className="vertical-container top-border">
                                <div className="horizontal-container space-between">
                                    <div className="horizontal-container gap-05">
                                        <button onClick={() => decreaseTime(x.id)}>-0.5s</button>
                                        {displayFromMillis(x.time)}
                                        <button onClick={() => increaseTime(x.id)}>+0.5s</button>
                                    </div>
                                    <button disabled={true}>Fehlteil (+5s)</button>
                                    <button disabled={x.table === undefinedTable} onClick={() => storeResult(x.competitorId, x.time, x.position, x.id)}>💾</button>
                                    <button onClick={() => deleteResult(x.id)}>🗑️</button>
                                </div>
                                <div className="horizontal-container">
                                    <div className="horizontal-container gap-05">
                                        <span>Tisch:</span>
                                        <input name="table-nr" className="small-input" type="number" value={x.table} onChange={e => setTableAtIdToValue(x.id, Number(e.target.value))} />
                                        <span>{x.competitorName}</span>
                                    </div>
                                </div>
                                <div className="horizontal-container">
                                    <div className="horizontal-container gap-05">
                                        <span>Puzzle:</span>
                                        <input name="puzzle-position" className="small-input" type="number" value={x.position} onChange={e => setPositionAtIdToValue(x.id, Number(e.target.value))} />
                                        <img height="50" src={x.puzzleUrl} />
                                    </div>
                                </div>
                            </div></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>)
}