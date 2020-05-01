import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button } from 'reactstrap';
import * as moment from "moment";

const GoalList = (props) => {

    // gets all goals created by the logged in user and sets them in state
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getGoals = () => {
        return GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
            setGoals(goalsFromApi)
        });
    };

    // constructs an updated goal object where is complete is set to false, saves it to the database, and triggers a page reload
    const handleUndoMarkComplete = (goalId) => {
        setIsLoading(true);
        GoalApiManager.getGoalById(goalId).then(goal => {

            // uses moment.js to convert dates to MM/DD/YYYY format
            const uncompletedGoal = {
                id: goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: moment(goal.complete_by).format('L'),
                is_complete: false,
                completed_on: ""
            };

            GoalApiManager.putGoal(uncompletedGoal)
                .then(() => {
                    setIsLoading(false)
                    getGoals()
                });
        });
    };

    // deletes a specific goal from the database, updates the goals in state, and triggers a page re-load
    const handleGoalDelete = (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            setIsLoading(true);
            GoalApiManager.deleteGoal(goalId).then(() => GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
                setGoals(goalsFromApi);
                setIsLoading(false);
            }));
        };
    };

    // gets the goals after the initial page render
    useEffect(() => {
        getGoals();
    }, []);

    // returns the 'add goal' button and all of the goal cards 
    // the commented out code below was to display a message to the user if they had not created any goals yet - will revisit this code at a later time
    return (
        // <>
        //     {(goals.length !== 0) ?
                <>
                    <div className="add-goal-button-container">
                        {/* when the 'add goal' button is clicked, re-direct to the 'add a new goal' form */}
                        <Button type="button" className="add-goal-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</Button>
                    </div>

                    <div className="goal-cards-container">
                        {/* for each goal set in the goals state, return a goal card */}
                        {goals.map(goal =>
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                isLoading={isLoading}
                                handleUndoMarkComplete={handleUndoMarkComplete}
                                handleGoalDelete={handleGoalDelete}
                                {...props}
                            />
                        )}
                    </div>
                </>
        //         :
        //         <>
        //             <div className="add-goal-button-container">
        //                 <Button type="button" className="add-goal-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</Button>
        //             </div>
        //             <div className="no-goals-message-container">
        //             <Card body className="text-center no-goals-message-card">
        //                 <CardTitle className="no-goals-message">You have no saved goals.</CardTitle>
        //             </Card>
        //         </div>
        //         </>
        //     }
        // </>
    );
};

export default GoalList;