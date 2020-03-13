import React, { useState } from 'react';
import './Login.css';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleFieldChange = (evt) => {
        const stateToChange = { ...credentials };
        stateToChange[evt.target.id] = evt.target.value;
        setCredentials(stateToChange);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        sessionStorage.setItem(
            "credentials",
            JSON.stringify(credentials)
        );
        props.history.push("/");
    }

    return (
        <>
            <form onSubmit={handleLogin} id="login-form">
                <fieldset>
                    <h3>Please login</h3>
                    <div className="login-form">

                        <label htmlFor="inputEmail" id="email-label-login">Email address:</label>
                        <input onChange={handleFieldChange}
                            type="email"
                            id="email"
                            placeholder="Email address"
                            required=""
                            autoFocus="" />

                        <label htmlFor="inputPassword" id="password-label-login">Password:</label>
                        <input onChange={handleFieldChange}
                            type="password"
                            id="password"
                            placeholder="Password"
                            required=""
                            autoFocus="" />

                    </div>
                    <button type="submit" id="login-button">Login</button>
                </fieldset>
            </form>

            <form onSubmit={handleLogin} id="signUp-form">
                <fieldset>
                    <h3>Please sign up</h3>
                    <div className="signUp-form-fields">

                        <label htmlFor="inputEmail" id="email-label">Email address:</label>
                        <input onChange={handleFieldChange}
                            type="email"
                            id="newEmail"
                            placeholder="Email address"
                            required=""
                            autoFocus="" />

                        <label htmlFor="inputUsername" id="username-label">Username:</label>
                        <input onChange={handleFieldChange}
                            type="text"
                            id="username"
                            placeholder="Username"
                            required=""
                            autoFocus="" />

                        <label htmlFor="inputFirstName" id="firstName-label">First Name:</label>
                        <input onChange={handleFieldChange}
                            type="text"
                            id="first_name"
                            placeholder="First Name"
                            required=""
                            autoFocus="" />

                        <label htmlFor="inputLastName" id="lastName-label">Last Name:</label>
                        <input onChange={handleFieldChange}
                            type="text"
                            id="last_name"
                            placeholder="Last Name"
                            required=""
                            autoFocus="" />

                        <label htmlFor="inputPassword" id="password-label">Password:</label>
                        <input onChange={handleFieldChange}
                            type="password"
                            id="newPassword"
                            placeholder="Password"
                            required=""
                            autoFocus="" />

                    </div>
                    <button type="submit" id="signUp-button">Sign Up</button>
                </fieldset>
            </form>
        </>
    );
};

export default Login;