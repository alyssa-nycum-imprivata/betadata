import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import UserApiManager from '../../modules/UserApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
        <Form onSubmit={handleLogin} className="login-form">
            <FormGroup className="login-form-header-container">
                <h2 className="login-form-header">Please Login</h2>
            </FormGroup>
            <FormGroup className="login-form-input-container">
                <Label htmlFor="inputEmail" className="login-label"><strong>Email Address:</strong></Label>
                <Input onChange={handleLoginFieldChange}
                    className="login-input"
                    type="email"
                    id="email"
                    required=""
                    autoFocus="" />

                <Label htmlFor="inputPassword" className="login-label"><strong>Password:</strong></Label>
                <Input onChange={handleLoginFieldChange}
                    className="login-input"
                    type="password"
                    id="password"
                    required=""
                    autoFocus="" />
            </FormGroup>

            <FormGroup className="login-form-note-container">
                <h6>If you are a new user, <Link className="signUp-link"
                    to={"/signup"}>click here to sign up.</Link></h6>
            </FormGroup>

            <FormGroup className="login-form-button-container">
                <Button type="submit" className="login-form-login-button">Login</Button>
            </FormGroup>
        </Form>
    );
};

export default Login;