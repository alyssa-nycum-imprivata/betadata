const baseUrl = "http://localhost:5002";

const AttemptApiManager = {

    // gets all attempts associated with a specific climb by the climb id
    getAttemptsByClimb(climbId) {
        return fetch(`${baseUrl}/attempts/?climbId=${climbId}`).then(resp => resp.json());
    },

    // gets a specific attempt by the attempt id
    getAttemptById(attemptId) {
        return fetch(`${baseUrl}/attempts/${attemptId}`).then(resp => resp.json());
    },

    // creates a new attempt
    postAttempt(newAttempt) {
        return fetch(`${baseUrl}/attempts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAttempt)
        }).then(resp => resp.json());
    },

    // deletes a specific attempt
    deleteAttempt(attemptId) {
        return fetch(`${baseUrl}/attempts/${attemptId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },

    // edits a specific attempt
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