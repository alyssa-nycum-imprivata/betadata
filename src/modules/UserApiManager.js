const baseUrl = "http://localhost:5002";

const UserApiManager = {

    // gets all users
    getUsers() {
        return fetch(`${baseUrl}/users`).then(resp => resp.json());
    },

    // gets specific user by user id
    getUser(userId) {
        return fetch(`${baseUrl}/users/${userId}`).then(resp => resp.json());
    },

    // creates a new user
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