import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './components/home/Home';

import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';

import ClimbList from './components/climbs/ClimbList';
import ClimbForm from './components/climbs/ClimbForm';
import ClimbEditForm from './components/climbs/ClimbEditForm';

import AttemptForm from './components/attempts/AttemptForm';
import AttemptEditForm from './components/attempts/AttemptEditForm';

import GoalList from './components/goals/GoalList';
import GoalForm from './components/goals/GoalForm';
import GoalEditForm from './components/goals/GoalEditForm';
import GoalCompleteForm from './components/goals/GoalCompleteForm';

import GymList from './components/gyms/GymList';
import GymForm from './components/gyms/GymForm';

const ApplicationViews = (props) => {
    const hasUser = props.hasUser;
    const setUser = props.setUser;

    return (
        <>
            <Route
                exact
                path="/"
                render={() => {
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
                        return <ClimbList
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/climbs/new"
                render={props => {
                    if (hasUser) {
                        return <ClimbForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/climbs/:climbId(\d+)/edit"
                render={props => {
                    if (hasUser) {
                        return <ClimbEditForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/climbs/:climbId(\d+)/add_attempt"
                render={props => {
                    if (hasUser) {
                        return <AttemptForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/attempts/:attemptId(\d+)/edit"
                render={props => {
                    if (hasUser) {
                        return <AttemptEditForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/gyms"
                render={props => {
                    if (hasUser) {
                        return <GymList
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/gyms/new"
                render={props => {
                    if (hasUser) {
                        return <GymForm
                            {...props} />
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
                        return <GoalList
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/goals/new"
                render={props => {
                    if (hasUser) {
                        return <GoalForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/goals/:goalId(\d+)/edit"
                render={props => {
                    if (hasUser) {
                        return <GoalEditForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
            <Route
                exact
                path="/goals/:goalId(\d+)/complete"
                render={props => {
                    if (hasUser) {
                        return <GoalCompleteForm
                            {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }}
            />
        </>
    );
};

export default ApplicationViews;

