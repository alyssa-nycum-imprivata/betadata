import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';

const GoalCompleteForm = (props) => {
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: false, completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    const updateCompletedGoal = (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        const completedGoal = {
            id: parseInt(props.match.params.goalId),
            userId: activeUserId,
            goal_content: goal.goal_content,
            complete_by: goal.complete_by,
            is_complete: true,
            completed_on: goal.completed_on
        };

        GoalApiManager.putGoal(completedGoal)
            .then(() => props.history.push("/goals"));

    };

    useEffect(() => {
        GoalApiManager.getGoalById(props.match.params.goalId)
            .then(goal => {
                setGoal(goal);
                setIsLoading(false)
            });
    }, []);

    return (
        <>

            <form className="completed-goal-form">
                <fieldset className="completed-goal-fieldset">
                    <h2>GOAL COMPLETED!</h2>
                    <div className="completed-goal-container">

                        <label>Add an optional 'completed on' date below</label><br/><br/>

                        <label htmlFor="completed_on">Completed On:</label>
                        <input type="date"
                            id="completed_on"
                            required
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div className="completed-goal-button-container">
                        <button type="button" disabled={isLoading} onClick={updateCompletedGoal}>Add</button>
                        <button type="button" disabled={isLoading} onClick={updateCompletedGoal}>No Thanks</button>
                    </div>
                </fieldset>
            </form>
        </>
    )
};

export default GoalCompleteForm