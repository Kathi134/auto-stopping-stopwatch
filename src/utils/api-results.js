import { displayFromMillisWithoutMillis } from "./timeUtils";
import API from "./api";

const getCompetitorNextPuzzle = async ({ competitorId }) => {
    return fetch(`${API}/competitors/${competitorId}/next-puzzle`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch next puzzle");
            }

            return response.json();
        });
};

const postCompetitionResult = async ({ competitorId, puzzleId, time }) => {
    console.log("storing result on ", competitorId, "time", displayFromMillisWithoutMillis(time), "on puzzle", puzzleId)
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "resultType": "time",
            "value": displayFromMillisWithoutMillis(time),
            "competitorId": competitorId,
            "puzzleId": puzzleId,
        })
    };

    return fetch(`${API}/results`, options);
}

const postCompetitionPiecesResult = async ({ competitorId, puzzleId, pieces }) => {
    console.log("storing result on ", competitorId, "pieces", pieces, "on puzzle", puzzleId)

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            resultType: "pieces",
            value: pieces,
            competitorId,
            puzzleId
        })
    };

    return fetch(`${API}/results`, options);
};

export { postCompetitionResult, postCompetitionPiecesResult, getCompetitorNextPuzzle };