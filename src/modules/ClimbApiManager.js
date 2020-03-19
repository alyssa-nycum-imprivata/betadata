const baseUrl = "http://localhost:5002";

const ClimbApiManager = {
    getClimbs() {
        return fetch(`${baseUrl}/climbs`).then(resp => resp.json());
    },
    getClimbById(climbId) {
        return fetch(`${baseUrl}/climbs/${climbId}`).then(resp => resp.json());
    },
    getClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
    postClimb(newClimb) {
        return fetch(`${baseUrl}/climbs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClimb)
        }).then(resp => resp.json());
    },
    deleteClimb(climbId) {
        return fetch(`${baseUrl}/climbs/${climbId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },
    putClimb(editedClimb) {
        return fetch(`${baseUrl}/climbs/${editedClimb.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedClimb)
        }).then(resp => resp.json());
    }
};

export default ClimbApiManager;