import React, { useState } from 'react';
import './Auth.css';
import UserApiManager from '../../modules/UserApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const SignUp = (props) => {
    // preparing to set the new user's info in state
    const [newUser, setNewUser] = useState({ email: "", username: "", first_name: "", last_name: "" });
    const [isLoading, setIsLoading] = useState(false);

    // listens to what the user inputs into the form fields in real time and sets the user's info in state
    const handleSignUpFieldChange = (evt) => {
        const stateToChange = { ...newUser };
            stateToChange[evt.target.id] = evt.target.value;
            setNewUser(stateToChange);
    };

    // gets all users from the database and runs several checks to compare the info the user entered in with user info already in the database
    // if the new user's info passes the checks, a new user object is constructed & saved to the database and the user is re-directed to the login page and prompted to login
    const handleSignUp = (e) => {
        e.preventDefault();

        UserApiManager.getUsers().then(users => {
            // checks to see if the new user's email matches an email already stored in the database and returns a window alert if so
            const emails = users.filter(user => (newUser.email === user.email));
            // checks to see if the new user's username matches a username already stored in the database and returns a window alert if so
            const usernames = users.filter(user => (newUser.username === user.username));

            //  the email, username, first name, and last name fields must be filled out
            if (emails.length !== 0) {
                window.alert("Email already taken! Please try again.");
            } else if (usernames.length !== 0) {
                window.alert("Username already taken! Please try again.");
            } else if (newUser.email === "" || newUser.username === "" || newUser.first_name === "" || newUser.last_name === "") {
                window.alert("Please fill out all fields");
            } else {
                setIsLoading(true);

                const newUserObject = {
                    id: props.match.params.userId,
                    email: newUser.email,
                    username: newUser.username,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name
                };

                // returns an account successful window alert message and directs the new user to login
                UserApiManager.postUser(newUserObject)
                    .then(window.alert("Account creation successful! Now, please login."))
                    .then(() => props.history.push("/"));
            };
        });
    };

    // returns the sign up form with email address, username, first name, & last name inputs and 'sign up' & 'cancel' buttons
    return (
        // when the 'sign up' button is clicked, execute the handleSignUp function
        <Form onSubmit={handleSignUp} className="signUp-form">

            {/* form header */}
            <FormGroup className="signUp-form-header-container">
                <h2 className="signUp-form-header">Please Sign Up</h2>
            </FormGroup>

            <FormGroup className="signUp-form-input-container">
                <div className="signUp-form-input-div">
                    {/* email input */}
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputEmail" className="signUp-label signUp-label-left"><strong>Email Address:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-left"
                            type="email"
                            id="email"
                            required=""
                            autoFocus="" />
                    </div>

                    {/* username input */}
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputUsername" className="signUp-label signUp-label-right"><strong>Username:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-right"
                            type="text"
                            id="username"
                            required=""
                            autoFocus="" />
                    </div>
                </div>

                {/* first name input */}
                <div className="signUp-form-input-div">
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputFirstName" className="signUp-label signUp-label-left"><strong>First Name:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-left"
                            type="text"
                            id="first_name"
                            required=""
                            autoFocus="" />
                    </div>

                    {/* last name input */}
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputLastName" className="signUp-label signUp-label-right"><strong>Last Name:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-right"
                            type="text"
                            id="last_name"
                            required=""
                            autoFocus="" />
                    </div>
                </div>

            </FormGroup>

            <FormGroup className="signUp-form-button-container">
                <Button type="submit" disabled={isLoading} className="signUp-form-button signUp-form-signUp-button" size="lg">Sign Up</Button>
                {/* when the 'cancel' button is clicked, re-direct to the login form page */}
                <Button type="button" className="signUp-form-button signUp-form-cancel-button" size="lg" onClick={() => { props.history.push("/") }}>Cancel</Button>
            </FormGroup>
        </Form>
    );
};

export default SignUp;