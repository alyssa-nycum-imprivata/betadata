import React, { useState } from 'react';
import './Login.css';
import UserApiManager from '../../modules/UserApiManager';

const SignUp = (props) => {
    const [newUser, setNewUser] = useState({ email: "", username: "", password: "", first_name: "", last_name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpFieldChange = (evt) => {
        const stateToChange = { ...newUser };
        stateToChange[evt.target.id] = evt.target.value;
        setNewUser(stateToChange);
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        if (newUser.email === "" || newUser.username === "" || newUser.password === "" || newUser.first_name === "" || newUser.last_name === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const newUserObject = {
                id: props.match.params.userId,
                email: newUser.email,
                username: newUser.username,
                password: newUser.password,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            };

            UserApiManager.postUser(newUserObject)
                .then(() => props.history.push("/"));
        };
    };

    return (
        <form onSubmit={handleSignUp} id="signUp-form">
            <fieldset>
                <h3>Please sign up</h3>
                <div className="signUp-form-fields">

                    <label htmlFor="inputEmail"id="email-label">Email address:</label>
                    <input onChange={handleSignUpFieldChange}
                        type="email"
                        id="email"
                        placeholder="Email address"
                        required=""
                        autoFocus="" />

                    <label htmlFor="inputUsername" id="username-label">Username:</label>
                    <input onChange={handleSignUpFieldChange}
                        type="text"
                        id="username"
                        placeholder="Username"
                        required=""
                        autoFocus="" />

                    <label htmlFor="inputFirstName" id="firstName-label">First Name:</label>
                    <input onChange={handleSignUpFieldChange}
                        type="text"
                        id="first_name"
                        placeholder="First Name"
                        required=""
                        autoFocus="" />

                    <label htmlFor="inputLastName" id="lastName-label">Last Name:</label>
                    <input onChange={handleSignUpFieldChange}
                        type="text"
                        id="last_name"
                        placeholder="Last Name"
                        required=""
                        autoFocus="" />

                    <label htmlFor="inputPassword" id="password-label">Password:</label>
                    <input onChange={handleSignUpFieldChange}
                        type="password"
                        id="password"
                        placeholder="Password"
                        required=""
                        autoFocus="" />

                </div>
                <button type="submit"
                    disabled={isLoading}
                    id="signUp-button">Sign Up</button>
            </fieldset>
        </form>
    );
};

export default SignUp;