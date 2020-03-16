const baseUrl = "http://localhost:5002";

const ClimbApiManager = {
    getClimbs() {
        return fetch(`${baseUrl}/climbs`).then(resp => resp.json());
    }
};

export default ClimbApiManager;