import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';
import GoalApiManager from '../../modules/GoalApiManager';

const GoalList = (props) => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [is_complete, setIs_Complete] = useState(true)

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getGoals = () => {
        return GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
            setGoals(goalsFromApi);
        });
    };

    const toggleCompletedCheckbox = (goalId) => {
        setIs_Complete(!is_complete);
        
        GoalApiManager.getGoalById(goalId).then(goal => {

            const completedGoal = {
                id: goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: goal.complete_by,
                is_complete: is_complete
            };

            GoalApiManager.putGoal(completedGoal);
        });
    };

    useEffect(() => {
        setIs_Complete(is_complete)
    })

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

    if (goals.length !== 0) {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</button>
                </div>
                <div className="cards-container goal-cards-container">
                    {goals.map(goal =>
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            isLoading={isLoading}
                            toggleCompletedCheckbox={toggleCompletedCheckbox}
                            handleGoalDelete={handleGoalDelete}
                            {...props}
                        />
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</button>
                </div>
                <div>
                    <h2>You have no saved goals.</h2>
                </div>
            </>
        );
    };
};

export default GoalList;