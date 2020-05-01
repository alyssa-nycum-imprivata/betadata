import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import UserApiManager from '../../modules/UserApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const Login = (props) => {
    // preparing to set the existing user's info in state
    const [credentials, setCredentials] = useState({ email: "" });

    // listens to what the user inputs into the form fields in real time and sets the user's info in state
    const handleLoginFieldChange = (evt) => {
        const stateToChange = { ...credentials };
        stateToChange[evt.target.id] = evt.target.value;
        setCredentials(stateToChange);
    };

    // gets all users from the database, checks to see if the email entered is one that exists in the database, and sets session storage with the user's info & logs the user into the app if the email does exist
    const handleLogin = (e) => {
        e.preventDefault();

        UserApiManager.getUsers().then(users => {
            const userObject = users.filter(user => (credentials.email === user.email));

            // if the entered email does not exist in the database, return a window alert
            if (userObject.length !== 1) {
                window.alert("Incorrect email. Please try again. If you do not have an account, click the sign up link below.");
            } else {
                sessionStorage.setItem("userId", userObject[0].id);
                props.setUser(credentials);
                props.history.push("/");
            };
        });
    };

    // returns the login form with an email address input, a link to follow for new users, and a 'login' button
    return (
        // when the 'login' button is clicked, execute the handleLogin function
        <Form onSubmit={handleLogin} className="login-form">

            {/* form header */}
            <FormGroup className="login-form-header-container">
                <h2 className="login-form-header">Please Login</h2>
            </FormGroup>

            {/* email input */}
            <FormGroup className="login-form-input-container">
                <Label htmlFor="inputEmail" className="login-label"><strong>Email Address:</strong></Label>
                <Input onChange={handleLoginFieldChange}
                    className="login-input"
                    type="email"
                    id="email"
                    required=""
                    autoFocus="" />
            </FormGroup>

            {/* link for new users to follow */}
            <FormGroup className="login-form-note-container">
                <h6>If you are a new user, <Link className="signUp-link"
                    to={"/signup"}>click here to sign up.</Link></h6>
            </FormGroup>

            <FormGroup className="login-form-button-container">
                <Button type="submit" className="login-form-login-button" size="lg">Login</Button>
            </FormGroup>
        </Form>
    );
};

export default Login;