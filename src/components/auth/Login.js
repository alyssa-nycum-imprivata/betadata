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
                sessionStorage.setItem("userId", userObject[0].id);
                props.setUser(credentials);
                props.history.push("/");
            };
        });
    };

    return (
        <form onSubmit={handleLogin} id="login-form">
            <fieldset id="login-fieldset">
                <h3 className="form form-header">Please Login</h3>
                <div className="login-form">

                    <label className="form" htmlFor="inputEmail" id="email-label-login">Email Address:</label>
                    <input onChange={handleLoginFieldChange}
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        required=""
                        autoFocus="" />

                    <label className="form" htmlFor="inputPassword" id="password-label-login">Password:</label>
                    <input onChange={handleLoginFieldChange}
                        type="password"
                        id="password"
                        placeholder="Password"
                        required=""
                        autoFocus="" />

                </div>
                <div id="signUp-text">
                    <p className="form form-text">If you are a new user, <Link id="signUp-link"
                        to={"/signup"}>click here to sign up.</Link></p>
                </div>
                <div className="button-div">
                    <button type="submit" id="login-button">Login</button>
                </div>
            </fieldset>
        </form>
    );
};

export default Login;