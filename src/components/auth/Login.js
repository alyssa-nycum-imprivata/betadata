import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';


const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleLoginFieldChange = (evt) => {
        const stateToChange = { ...credentials };
        stateToChange[evt.target.id] = evt.target.value;
        setCredentials(stateToChange);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        props.setUser(credentials);
        props.history.push("/");
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