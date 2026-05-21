const API = "http://185.249.198.58:8083/api";

const postCompetitionStart = ({ time, id }) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "startingTime": time
        })
    };

    fetch(`${API}/competition/${id}/startingTime`, options)
        // .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

const getCompetitonStart = ({ id }) => {
    const options = { method: 'GET' };

    return fetch(`${API}/competition/${id}/startingTime`, options)
        .then(response => response.json())
        .catch(err => console.error(err));
}

const getCompetitorForTable = ({ competitionId, table }) => {
    console.log("request competitor for", competitionId, table)
    return new Promise((resolve) => {
        resolve({ name: "firstname lastname", id: "(id)" });
    });
}

const postCompetitionResultForTable = ({ competitorId, time, pieces }) => {

}

export { postCompetitionStart, getCompetitonStart, getCompetitorForTable, postCompetitionResultForTable };