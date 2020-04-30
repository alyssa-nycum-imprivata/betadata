const baseUrl = "http://localhost:5002";

const ClimbApiManager = {

    // gets a specific climb by the climb id
    getClimbById(climbId) {
        return fetch(`${baseUrl}/climbs/${climbId}`).then(resp => resp.json());
    },

    // gets all climbs created by a specific user using the user id
    getClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },

    // gets only active climbs created by a specific user using the user id
    getActiveClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&is_archived=false`).then(resp => resp.json());
    },

    // gets specific climbs created by a specific user based off of climb properties selected by the user
    getClimbsByFilter(userId, filteredProperties) {
        if (filteredProperties.length > 1) {
            const joinFilteredProperties = filteredProperties.join("&")
            return fetch(`${baseUrl}/climbs/?userId=${userId}&${joinFilteredProperties}`).then(resp => resp.json());
        } else if (filteredProperties.length === 1) {
            return fetch(`${baseUrl}/climbs/?userId=${userId}&${filteredProperties}`).then(resp => resp.json())
        } else {
            return fetch(`${baseUrl}/climbs/?userId=${userId}`).then(resp => resp.json())
        }
    },

    // creates a new climb
    postClimb(newClimb) {
        return fetch(`${baseUrl}/climbs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClimb)
        }).then(resp => resp.json());
    },

    // deletes a specific climb
    deleteClimb(climbId) {
        return fetch(`${baseUrl}/climbs/${climbId}`, {
            method: "DELETE"
        }).then(resp => resp.json());
    },

    // edits a specific climb
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