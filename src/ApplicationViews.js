import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/auth/Login';

const ApplicationViews = (props) => {
    const isAuthenticated = () => sessionStorage.getItem("credentials") !== null;

    return (
        <>
            <Route 
            exact
            path="/"
            render={props => {
                if (isAuthenticated()) {                return <Home />
                } else {
                    return <Redirect to="/login" />
                }
            }}
            />
            <Route path="/login" component={Login} />
        </>
    );
};

export default ApplicationViews;

