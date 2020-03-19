const baseUrl = "http://localhost:5002";

const GoalApiManager = {
    getGoalsByUser(userId) {
        return fetch(`${baseUrl}/goals/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
};

export default GoalApiManager;