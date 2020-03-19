const baseUrl = "http://localhost:5002";

const GoalApiManager = {
    getGoalsByUser(userId) {
        return fetch(`${baseUrl}/goals/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
    getGoalById(goalId) {
        return fetch(`${baseUrl}/goals/${goalId}`).then(resp => resp.json());
    },
    postGoal(newGoal) {
        return fetch(`${baseUrl}/goals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGoal)
        }).then(resp => resp.json());
    },
    deleteGoal(goalId) {
        return fetch(`${baseUrl}/goals/${goalId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },
    putGoal(editedGoal) {
        return fetch(`${baseUrl}/goals/${editedGoal.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedGoal)
        }).then(resp => resp.json());
    }
};

export default GoalApiManager;