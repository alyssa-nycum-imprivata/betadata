const baseUrl = "http://localhost:5002";

const GoalApiManager = {

    // gets all goals created by a specific user using the user id
    getGoalsByUser(userId) {
        return fetch(`${baseUrl}/goals/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },

    // gets a specific goal by the goal id
    getGoalById(goalId) {
        return fetch(`${baseUrl}/goals/${goalId}`).then(resp => resp.json());
    },

    // creates a new goal
    postGoal(newGoal) {
        return fetch(`${baseUrl}/goals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGoal)
        }).then(resp => resp.json());
    },

    // deletes a specific goal
    deleteGoal(goalId) {
        return fetch(`${baseUrl}/goals/${goalId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },

    // edits a specific goal
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