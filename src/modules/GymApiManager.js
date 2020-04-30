const baseUrl = "http://localhost:5002";

const GymApiManager = {

    // gets all gyms created by a specific user using the user id
    getGymsByUser(userId) {
        return fetch(`${baseUrl}/gyms/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },

    // gets a specific gym by the gym id
    getGymById(gymId) {
        return fetch(`${baseUrl}/gyms/${gymId}`).then(resp => resp.json());
    },

    // creates a new gym
    postGym(newGym) {
        return fetch(`${baseUrl}/gyms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGym)
        }).then(resp => resp.json());
    },

    // deletes a specific gym
    deleteGym(gymId) {
        return fetch(`${baseUrl}/gyms/${gymId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },

    // edits a specific gym
    putGym(editedGym) {
        return fetch(`${baseUrl}/gyms/${editedGym.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedGym)
        }).then(resp => resp.json());
    }
};

export default GymApiManager;