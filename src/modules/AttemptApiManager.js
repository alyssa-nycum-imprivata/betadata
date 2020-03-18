const baseUrl = "http://localhost:5002";

const AttemptApiManager = {
    getAttemptsByClimb(climbId) {
        return fetch(`${baseUrl}/attempts/?climbId=${climbId}`).then(resp => resp.json());
    },
    getAttemptById(attemptId) {
        return fetch(`${baseUrl}/attempts/${attemptId}`).then(resp => resp.json());
    },
    postAttempt(newAttempt) {
        return fetch(`${baseUrl}/attempts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAttempt)
        }).then(resp => resp.json());
    },
    putAttempt(editedAttempt) {
        return fetch(`${baseUrl}/attempts/${editedAttempt.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedAttempt)
        }).then(resp => resp.json());
    }
};

export default AttemptApiManager;