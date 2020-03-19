import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';

const GoalForm = (props) => {
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: false });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    const constructNewGoal = (evt) => {
        evt.preventDefault();
        if (goal.goal_content === "" || goal.complete_by === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true)

            const newGoal = {
                id: props.match.params.goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: goal.complete_by,
                is_complete: false
            };

            GoalApiManager.postGoal(newGoal).then(() => props.history.push("/goals"));
        };
    };

    return (
        <>
            <form className="new-goal-form">
                <fieldset className="new-goal-fieldset">
                    <h2>Add a New Goal</h2>
                    <div className="new-goal-container">
                        <label htmlFor="goal_content">Goal:</label>
                        <input type="text"
                            id="goal_content"
                            required
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="complete_by">Complete By:</label>
                        <input type="date"
                            id="complete_by"
                            required
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div className="add-goal-button-container">
                        <button type="button" disabled={isLoading} onClick={constructNewGoal}>Add</button>
                        <button type="button" className="cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default GoalForm;

