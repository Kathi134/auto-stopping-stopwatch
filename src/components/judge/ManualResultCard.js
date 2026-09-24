import { useCallback, useState, useMemo } from "react";
import { getCompetitorNextPuzzle } from "../../utils/api-results";

export default function ManualResultCard({ marathon, onSave, onDelete, puzzles, competitors }) {
    const [table, setTable] = useState("");
    const [resultType, setResultType] = useState("pieces");
    const [value, setValue] = useState("");
    const [position, setPosition] = useState("");

    const competitor = useMemo(() => {
        return competitors.find(
            competitor => competitor.table_nr === Number(table)
        );
    }, [competitors, table]);

    const handleSaveClick = useCallback((table, position) => {
        onSave({
            competitorId: competitors.find(c => c.table_nr === Number(table)).id,
            "table": Number(table),
            resultType,
            value,
            "position": marathon
                ? Number(position)
                : undefined
        });
    }, [onSave, competitors, resultType, value, marathon]);

    const handleTableChange = useCallback(async (e) => {
        const tableValue = e.target.value;
        setTable(tableValue);

        const foundCompetitor = competitors.find(
            competitor => competitor.table_nr === Number(tableValue)
        );

        if (!marathon || !foundCompetitor) {
            setPosition("");
            return;
        }

        const nextPuzzle = await getCompetitorNextPuzzle({
            competitorId: foundCompetitor.id
        });

        setPosition(nextPuzzle.nextPuzzlePosition);
    }, [competitors, marathon]);

    const handleTypeChange = useCallback((e) => {
        setResultType(e.target.value);
        setValue("");
    }, [])



    const competitorName = useMemo(() => {
        return competitor?.users
            ?.map(user => `${user.first_name} ${user.last_name}`)
            .join(", ");
    }, [competitor]);

    const puzzle = useMemo(() => {
        return puzzles.find(
            puzzle => puzzle.position === Number(position)
        );
    }, [puzzles, position]);

    return (
        <div className="vertical-container top-border">

            <div className="horizontal-container space-between">
                <select className="small-input medium-wide" value={resultType} onChange={handleTypeChange}>
                    <option value="time">Zeit</option>
                    <option value="pieces">Anzahl Teile</option>
                </select>
                {resultType === "time"
                    ? <input className="small-input medium-wide" type="text" placeholder="00:00:00" value={value} onChange={e => setValue(e.target.value)} />
                    : <input className="small-input medium-wide" type="number" min="0" value={value} onChange={e => setValue(e.target.value)} />
                }
            </div>

            <div className="horizontal-container top-sdy-border">
                <div className="horizontal-container gap-05">
                    <span>Tisch:</span>
                    <input name="table-nr" className="small-input" type="number" value={table} onChange={handleTableChange} />
                    <span className="competitor-name">{competitorName ?? "nicht zugeordnet."}</span>
                </div>
            </div>

            <div className="horizontal-container top-sdy-border">
                <div className="horizontal-container gap-05">
                    <span>Puzzle:</span>
                    <input name="puzzle-position" className="small-input" type="number" value={position} onChange={e => setPosition(e.target.value)} />
                    {puzzle?.image
                        ? <img height="50" src={puzzle?.image} alt="nicht zugeordnet" className="puzzle-image" />
                        : <span className="competitor-name">nicht zugeordnet.</span>
                    }
                </div>
            </div>

            <div className="horizontal-container top-sdy-border btn-column default-back">
                <button className="save-btn" onClick={() => handleSaveClick(table, position)}>💾</button>
                <button className="delete-btn" onClick={onDelete}>🗑️</button>
            </div>


        </div>
    );
}