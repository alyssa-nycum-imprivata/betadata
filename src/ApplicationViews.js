import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';

const ApplicationViews = (props) => {
    const hasUser = props.hasUser;
    const setUser = props.setUser;

    return (
        <>
            <Route
                exact
                path="/"
                render={props => {
                    if (hasUser) {
                        return <Home />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route path="/login" render={props => {
                return <Login setUser={setUser} {...props} />
            }}
            />
            <Route path="/signup" render={props => {
                return <SignUp {...props} />
            }}
            />
        </>
    );
};

export default ApplicationViews;

