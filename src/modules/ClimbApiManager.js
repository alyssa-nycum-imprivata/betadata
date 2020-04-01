const baseUrl = "http://localhost:5002";

const ClimbApiManager = {
    getClimbById(climbId) {
        return fetch(`${baseUrl}/climbs/${climbId}`).then(resp => resp.json());
    },
    getClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
    getActiveClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&is_archived=false`).then(resp => resp.json());
    },
    getArchivedClimbsByUser(userId) {
        return fetch(`${baseUrl}/climbs/?userId=${userId}&is_archived=true`).then(resp => resp.json());
    },
    getClimbsByFilter(userId, filteredProperties) {
        if (filteredProperties.length > 1) {
            const joinFilteredProperties = filteredProperties.join("&")
            console.log(joinFilteredProperties)
            console.log(`${baseUrl}/climbs/?userId=${userId}&${joinFilteredProperties}`)
            return fetch(`${baseUrl}/climbs/?userId=${userId}&${joinFilteredProperties}`).then(resp => resp.json());
        } else if (filteredProperties.length === 1) {
            console.log(`${baseUrl}/climbs/?userId=${userId}&${filteredProperties}`)
            return fetch(`${baseUrl}/climbs/?userId=${userId}&${filteredProperties}`).then(resp => resp.json())
        } else {
            console.log(`${baseUrl}/climbs/?userId=${userId}`)
            return fetch(`${baseUrl}/climbs/?userId=${userId}`).then(resp => resp.json())
        }
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