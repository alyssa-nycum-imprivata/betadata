import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home/Home';

const ApplicationViews = (props) => {
    return (
        <>
            <Route 
            exact
            path="/"
            render={props => {
                return <Home />
            }}
            />
        </>
    );
};

export default ApplicationViews;

