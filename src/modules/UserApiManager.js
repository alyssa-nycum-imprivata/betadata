const baseUrl = "http://localhost:5002";

const UserApiManager = {
    getUsers() {
        return fetch(`${baseUrl}/users`).then(resp => resp.json());
    },
    postUser(newUser) {
        return fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }).then(resp => resp.json())
    }
};

export default UserApiManager;