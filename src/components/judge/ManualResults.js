import { useCallback, useState } from "react";
import { postCompetitionPiecesResult, postCompetitionResult } from "../../utils/api-results";
import "../../styles/index.css"
import ManualResultCard from "./ManualResultCard";

export default function ManualResults({
    competitors,
    puzzles,
    marathon
}) {
    const [manualResults, setManualResults] = useState([]);
    const [ctr, setCtr] = useState(0);

    const addManualResult = () => {
        const id = ctr;
        setManualResults(prev => [...prev, { id }]);
        setCtr(prev => prev + 1);
    };

    const deleteManualResult = (id) => {
        setManualResults(prev =>
            prev.filter(result => result.id !== id)
        );
    };


    const storeManualResult = useCallback((id, { competitorId, resultType, value, position }) => {
        const request = resultType === "time"
            ? postCompetitionResult({ competitorId, puzzleId: position, time: value })
            : postCompetitionPiecesResult({ competitorId, puzzleId: position, pieces: value });

        request
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    alert("could not store.");
                }
                else {
                    deleteManualResult(id);
                }
            })
            .catch(error => {
                console.error(error);
                alert("could not store.");
            });
    }, []);

    return (
        <div className="center">
            <div id="sub-header">Manuelle Ergebniserfassung:</div>

            <button className="top-margin adj-time-btn" onClick={addManualResult}>
                Ergebnis hinzufügen
            </button>

            <div className="padded">
                <table><tbody>
                    {manualResults.map(result => (<tr><td>
                        <ManualResultCard
                            key={result.id}
                            competitors={competitors}
                            puzzles={puzzles}
                            marathon={marathon}
                            onSave={(data) => storeManualResult(result.id, data)}
                            onDelete={() => deleteManualResult(result.id)}
                        />
                    </td></tr>
                    ))}
                </tbody></table>

            </div>
        </div>
    );
}