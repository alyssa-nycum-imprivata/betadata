import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import UserApiManager from '../../modules/UserApiManager';


const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleLoginFieldChange = (evt) => {
        const stateToChange = { ...credentials };
        stateToChange[evt.target.id] = evt.target.value;
        setCredentials(stateToChange);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        UserApiManager.getUsers().then(users => {
            const userObject = users.filter(user => (credentials.email === user.email && credentials.password === user.password));

            if (userObject.length !== 1) {
                window.alert("Incorrect email or password. Please try again. If you do not have an account, click the sign up link below.");
            } else {
                props.setUser(credentials);
                props.history.push("/");
            };
        });
    };

    return (
        <form onSubmit={handleLogin} id="login-form">
            <fieldset>
                <h3>Please login</h3>
                <div className="login-form">

                    <label htmlFor="inputEmail"id="email-label-login">Email address:</label>
                    <input onChange={handleLoginFieldChange}
                        type="email"
                        id="email"
                        placeholder="Email address"
                        required=""
                        autoFocus="" />

                    <label htmlFor="inputPassword" id="password-label-login">Password:</label>
                    <input onChange={handleLoginFieldChange}
                        type="password"
                        id="password"
                        placeholder="Password"
                        required=""
                        autoFocus="" />

                </div>
                <div id="signUp-text">
                    If you are a new user, <Link id="signUp-link"
                        to={"/signup"}>click here to sign up.</Link>
                </div>
                <button type="submit" id="login-button">Login</button>
            </fieldset>
        </form>
    );
};

export default Login;