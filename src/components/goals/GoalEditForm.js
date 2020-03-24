import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
            <Form className="edit-goal-form">
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">Edit Goal</h2>
                </FormGroup>
                <FormGroup className="goal-form-input-container">
                    <Label htmlFor="goal_content" className="goal-label"><strong>Goal:</strong></Label>
                    <Input type="text"
                        className="goal-input"
                        id="goal_content"
                        required
                        value={goal.goal_content}
                        onChange={handleFieldChange}
                    />

                    <Label htmlFor="complete_by" className="goal-label"><strong>Complete By:</strong></Label>
                    <Input type="date"
                        className="goal-input"
                        id="complete_by"
                        required
                        value={goal.complete_by}
                        onChange={handleFieldChange}
                    />

                    {goal.is_complete === true ?
                        <>
                            <Label htmlFor="completed_on" className="goal-label"><strong>Completed On:</strong></Label>
                            <Input type="date"
                                className="goal-input"
                                id="completed_on"
                                required
                                value={goal.completed_on}
                                onChange={handleFieldChange}
                            />
                        </>
                        : null}
                </FormGroup>
                <FormGroup className="goal-form-button-container">
                    <Button type="button" disabled={isLoading} className="goal-form-button goal-form-save-button" onClick={updateExistingGoal}>Save</Button>
                    <Button type="button" className="goal-form-button goal-form-cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GoalEditForm;