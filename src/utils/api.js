import { displayFromMillisWithoutMillis } from "./timeUtils";

const API = "http://185.249.198.58:8083/api";

const postCompetitionStart = ({ time, id }) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "startingTime": time
        })
    };

    fetch(`${API}/competitions/${id}/startingTime`, options)
        // .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

const getCompetitonStart = async ({ id }) => {
    const options = { method: 'GET' };

    return fetch(`${API}/competitions/${id}/startingTime`, options)
        .then(response => response.json())
        .catch(err => console.error(err));
}

const getCompetititonData = async ({ competitionId }) => {
    const options = { method: 'GET' };

    return fetch(`${API}/competitions/${competitionId}`, options)
        .then(response => response.json())
        .catch(err => console.error(err));
}

const getCompetitorsForCompetition = async ({ competitionId }) => {
    const options = { method: 'GET' };

    return fetch(`${API}/competitions/${competitionId}/getCompetitorsWithTableNrs`, options)
        .then(response => response.json())
        .catch(err => console.error(err));
};

const postCompetitionResult = async ({ competitorId, time }) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "resultType": "time",
            "value": displayFromMillisWithoutMillis(time),
            "competitorId": competitorId,
        })
    };

    return fetch(`${API}/results/`, options);
}

export { postCompetitionStart, getCompetitonStart, getCompetititonData, postCompetitionResult };