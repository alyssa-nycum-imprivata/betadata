const baseUrl = "http://localhost:5002";

const ClimbApiManager = {
    getClimbs() {
        return fetch(`${baseUrl}/climbs`).then(resp => resp.json());
    },
    getClimbsByUser(userId) {
        console.log(`${baseUrl}/climbs/?userId=${userId}&_expand=user`);
        return fetch(`${baseUrl}/climbs/?userId=${userId}&_expand=user`).then(resp => resp.json());
    },
    postClimb(newClimb) {
        return fetch(`${baseUrl}/climbs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClimb)
        }).then(resp => resp.json())
    }
};

export default ClimbApiManager;