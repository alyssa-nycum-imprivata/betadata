const baseUrl = "http://localhost:5002";

const AttemptApiManager = {
    getAttemptsByClimb(climbId) {
        return fetch(`${baseUrl}/attempts/?climbId=${climbId}`).then(resp => resp.json());
    },
    postAttempt(newAttempt) {
        return fetch(`${baseUrl}/attempts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAttempt)
        }).then(resp => resp.json());
    }
};

export default AttemptApiManager;