import { useCallback, useState } from "react";
import { getCompetitorNextPuzzle, postCompetitionResult } from "../../utils/api-results";

const undefinedTable = -1;
const undefinedId = -1;
const undefinedPosition = -1;
const undefinedName = "nicht zugeordnet.";

export default function usePendingResults(competitors, puzzles) {
    const [pendingResults, setPendingResults] = useState([]);
    const [ctr, setCtr] = useState(0);

    // Find competitor belonging to a table number
    const getCompetitorForTable = useCallback((table) => {
        return competitors
            .filter(x => x.table_nr === table)
            .map(x => ({
                id: x.id,
                name: x.users
                    .map(user => `${user.first_name} ${user.last_name}`)
                    .join(", ")
            }))[0] ?? {
            name: undefinedName,
            id: undefinedId
        };
    }, [competitors]);

    // Add a new result
    const addResult = useCallback((time) => {
        setPendingResults(prev => [
            ...prev,
            {
                id: ctr,
                time,
                position: undefinedPosition,
                table: undefinedTable,
                competitorName: undefinedName,
                competitorId: undefinedId
            }
        ]);

        setCtr(prev => prev + 1);
    }, [ctr]);

    // Change table number
    const setTableAtIdToValue = useCallback(async (id, value) => {
        const competitorData = getCompetitorForTable(value);
        const cId = competitorData.id;

        setPendingResults(prev =>
            prev.map(result => {
                if (result.id !== id) {
                    return result;
                }

                return {
                    ...result,
                    table: value,
                    competitorName: competitorData.name,
                    competitorId: cId,
                    position: undefinedPosition,
                    puzzleUrl: undefined,
                };
            })
        );

        if (cId === undefinedId)
            return;

        const nextPuzzle = await getCompetitorNextPuzzle({ competitorId: cId });

        setPendingResults(prev =>
            prev.map(result => {
                if (result.id !== id) {
                    return result;
                }

                return {
                    ...result,
                    position: nextPuzzle.nextPuzzlePosition,
                    puzzleUrl: puzzles.find(puzzle => puzzle.position === nextPuzzle.nextPuzzlePosition)?.image
                };
            })
        );
    }, [getCompetitorForTable, puzzles]);

    // Change puzzle position
    const setPositionAtIdToValue = useCallback((id, value) => {
        setPendingResults(prev =>
            prev.map(result => {
                if (result.id !== id) {
                    return result;
                }

                return {
                    ...result,
                    position: value,
                    puzzleUrl: puzzles.find(puzzle => puzzle.position === value)?.image
                };
            })
        );
    }, [puzzles]);

    // Delete result
    const deleteResult = useCallback((id) => {
        setPendingResults(prev =>
            prev.filter(result => result.id !== id)
        );
    }, []);

    // Apply result changes
    const updateResult = useCallback((id, changes) => {
        setPendingResults(prev =>
            prev.map(result =>
                result.id === id
                    ? { ...result, ...changes }
                    : result
            )
        );
    }, []);



    // Save result
    const storeResult = useCallback((competitorId, time, position, id) => {
        postCompetitionResult({
            competitorId,
            puzzleId: position,
            time
        })
            .then(response => {
                console.log(response);

                if (response.status === 200) {
                    deleteResult(id);
                } else {
                    alert("could not store.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("could not store.");
            });
    }, [deleteResult]);

    return {
        pendingResults,
        addResult,
        setTableAtIdToValue,
        setPositionAtIdToValue,
        deleteResult,
        updateResult,
        storeResult
    };
}