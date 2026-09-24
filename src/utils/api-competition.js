import API from "./api";

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

export { postCompetitionStart, getCompetitonStart, getCompetititonData }