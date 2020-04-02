const baseUrl = "http://localhost:5002";

const GymApiManager = {
    getGymsByUser(userId) {
        return fetch(`${baseUrl}/gyms/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
    getGymById(gymId) {
        return fetch(`${baseUrl}/gyms/${gymId}`).then(resp => resp.json());
    },
    postGym(newGym) {
        return fetch(`${baseUrl}/gyms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGym)
        }).then(resp => resp.json());
    },
    deleteGym(gymId) {
        return fetch(`${baseUrl}/gyms/${gymId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },
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