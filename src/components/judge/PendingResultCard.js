
import { displayFromMillis } from "../../utils/timeUtils";

export default function PendingResultCard({
    result,
    marathon,
    onChange,
    onTableChange,
    onPositionChange,
    onSave,
    onDelete,
}) {
    const undefinedTable = -1;
    const undefinedName = "nicht zugeordnet.";

    const increaseTime = () => {
        onChange({ time: result.time + 1000 });
    };

    const decreaseTime = () => {
        onChange({ time: result.time - 1000 });
    };

    return (
        <div className="vertical-container top-border">
            <div className="horizontal-container space-between">
                <div className="horizontal-container gap-05">
                    <button className="adj-time-btn" onClick={decreaseTime}>-1s</button>
                    {displayFromMillis(result.time)}
                    <button className="adj-time-btn" onClick={increaseTime}>+1s</button>
                </div>
                {marathon
                    ? <span className="thirdary-text">Bei Fehlteilen 5s warten, bevor das nächste Puzzle gegeben wird.</span>
                    : <button className="adj-time-btn" disabled={true}>Fehlteil (+5s)</button>
                }
            </div>
            <div className="horizontal-container top-sdy-border">
                <div className="horizontal-container gap-05">
                    <span>Tisch:</span>
                    <input name="table-nr" className="small-input" type="number" value={result.table} onChange={e => onTableChange(result.id, Number(e.target.value))} />
                    <span className="competitor-name">{result.competitorName}</span>
                </div>
            </div>
            <div className="horizontal-container top-sdy-border">
                <div className="horizontal-container gap-05">
                    <span>Puzzle:</span>
                    <input name="puzzle-position" className="small-input" type="number" value={result.position} onChange={e => onPositionChange(result.id, Number(e.target.value))} />
                    {result.puzzleUrl
                        ? <img height="50" src={result.puzzleUrl} alt={undefinedName} className="puzzle-image" />
                        : <span className="competitor-name">{undefinedName}</span>
                    }
                </div>
            </div>
            <div className="horizontal-container top-sdy-border btn-column">
                <button className="save-btn" disabled={result.table === undefinedTable} onClick={() => onSave(result.competitorId, result.time, result.position, result.id)}>💾</button>
                <button className="delete-btn" onClick={() => onDelete(result.id)}>🗑️</button>
            </div>
        </div>
    );
}