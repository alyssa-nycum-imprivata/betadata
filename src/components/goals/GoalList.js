import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button } from 'reactstrap';

const GoalList = (props) => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getGoals = () => {
        return GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
            setGoals(goalsFromApi)
        });
    };

    const handleUndoMarkComplete = (goalId) => {
        setIsLoading(true);
        GoalApiManager.getGoalById(goalId).then(goal => {

            const uncompletedGoal = {
                id: goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: goal.complete_by,
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

    const handleGoalDelete = (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            setIsLoading(true);
            GoalApiManager.deleteGoal(goalId).then(() => GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
                setGoals(goalsFromApi);
                setIsLoading(false);
            }));
        };
    };

    useEffect(() => {
        getGoals();
    }, []);

    return (
        <>
            {(goals.length !== 0) ?
                <>
                    <div className="add-goal-button-container">
                        <Button type="button" className="add-goal-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</Button>
                    </div>
                    <div className="goal-cards-container">
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
                :
                <>
                    <div className="add-goal-button-container">
                        <Button type="button" className="add-goal-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</Button>
                    </div>
                    <div>
                        <h2>You have no saved goals.</h2>
                    </div>
                </>
            }
        </>
    );
};

export default GoalList;