import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';

const GoalEditForm = (props) => {
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: "", completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    const updateExistingGoal = (evt) => {
        evt.preventDefault();
        if (goal.goal_content === "" || goal.complete_by === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const editedGoal = {
                id: parseInt(props.match.params.goalId),
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: goal.complete_by,
                is_complete: goal.is_complete,
                completed_on: goal.completed_on
            };

            GoalApiManager.putGoal(editedGoal)
                .then(() => props.history.push("/goals"));
        };
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
            <form className="edit-goal-form">
                <fieldset className="edit-goal-fieldset">
                    <h2>Edit Goal</h2>
                    <div className="edit-goal-container">
                        <label htmlFor="goal_content">Goal:</label>
                        <input type="text"
                            id="goal_content"
                            required
                            value={goal.goal_content}
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="complete_by">Complete By:</label>
                        <input type="date"
                            id="complete_by"
                            required
                            value={goal.complete_by}
                            onChange={handleFieldChange}
                        />

                        {goal.is_complete === true ?
                        <>
                        <label htmlFor="completed_on">Completed On:</label>
                        <input type="date"
                            id="completed_on"
                            required
                            value={goal.completed_on}
                            onChange={handleFieldChange}
                        />
                        </>
                        : null }
                    </div>

                    <div className="update-goal-button-container">
                        <button type="button" disabled={isLoading} onClick={updateExistingGoal}>Save</button>
                        <button type="button" className="cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default GoalEditForm;