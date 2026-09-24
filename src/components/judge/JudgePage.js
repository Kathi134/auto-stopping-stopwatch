import { useEffect, useState } from "react";
import MODES from "../../model/modes";
import { getCompetitonStart, getCompetititonData } from "../../utils/api-competition";
import Timer from "./Timer";
import "../../styles/judge.css"
import ToggleTheme from "../main/ToggleTheme";
import JudgeModeSelection from "./JudgeModeSelection";
import ToggleOptionsMenu from "../main/ToggleOptionsMenu";
import { useSettings } from "../../context/SettingsContext";
import PendingResultCard from "./PendingResultCard";
import usePendingResults from "./usePendingResults";

const marathon = true;

export default function JudgePage({ foo }) {
    const { settings } = useSettings();

    const [competitors, setCompetitors] = useState([]);
    const [puzzles, setPuzzles] = useState([]);

    const [mode, setMode] = useState(MODES[0]);
    const [startingTime, setStartingTime] = useState(0);

    const {
        pendingResults,
        addResult,
        setTableAtIdToValue,
        setPositionAtIdToValue,
        deleteResult,
        updateResult,
        storeResult
    } = usePendingResults(competitors, puzzles);


    // init starting time and competitorList wrt selected comp
    useEffect(() => {
        console.log("updating mode")
        getCompetitonStart({ id: mode.id })
            .then(x => setStartingTime(new Date(x?.starting_time)));
        getCompetititonData({ competitionId: mode.id })
            .then(x => {
                setPuzzles(x.puzzles);
                setCompetitors(x.competitors);
            });
    }, [mode.id])


    return (<div>
        <header>
            <h1 className="center">Ergebniserfassung</h1>

            <div className="horizontal-container" id="toggle-btns" >
                <ToggleTheme />
                <ToggleOptionsMenu />
            </div>
        </header>

        {settings.showOptionsMenu &&
            <JudgeModeSelection startingTime={startingTime} mode={mode} setMode={setMode} />
        }

        <div className="card">
            <div className="vertical-container center">
                <span>Hier klicken, um eine Zeit zu erfassen:</span>
                <Timer mode={mode} initBeginningTime={startingTime} onClick={addResult} />
            </div>
        </div>

        <div className="center">
            <div id="sub-header">Gesammelte Ergebnisse:</div>
            <div className="padded">
                <table>
                    <tbody>
                        {pendingResults?.map((x) =>
                            <tr key={x.id}><td>
                                <PendingResultCard
                                    result={x} marathon={marathon}
                                    onChange={(changes) => updateResult(x.id, changes)}
                                    onTableChange={setTableAtIdToValue} onPositionChange={setPositionAtIdToValue}
                                    onSave={storeResult} onDelete={deleteResult}
                                />
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="center">
            <div id="sub-header">Manuelle Ergebniseintragung:</div>
            <div className="padded">
                <button>Ergebnis hinzufügen</button>
            </div>
        </div>
    </div >)
}