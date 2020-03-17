const baseUrl = "http://localhost:5002";

const AttemptApiManager = {
    getAttemptsByUserAndClimb(userId, climbId) {
        return fetch(`${baseUrl}/attempts/?userId=${userId}&climbId=${climbId}`).then(resp => resp.json());
    }
};

export default AttemptApiManager;