import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ClimbList from './components/climbs/ClimbList';

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
            <Route
                exact
                path="/climbs"
                render={props => {
                    if (hasUser) {
                        return <ClimbList {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/goals"
                render={props => {
                    if (hasUser) {
                        return <h3>This is the goals page.</h3>
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/archive"
                render={props => {
                    if (hasUser) {
                        return <h3>This is the archive page.</h3>
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
        </>
    );
};

export default ApplicationViews;

