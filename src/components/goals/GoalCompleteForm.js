import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

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
            complete_by: moment(goal.complete_by).format('L'),
            is_complete: true,
            completed_on: goal.completed_on === "" ? "" : moment(goal.completed_on).format('L')
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
            <Form className="completed-goal-form">
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">GOAL COMPLETED!</h2>
                </FormGroup>
                <FormGroup className="goal-form-note-container">
                    <h6>Add an optional 'completed on' date below</h6>
                </FormGroup>
                <FormGroup className="goal-form-input-container">
                    <Label htmlFor="completed_on" className="goal-label"><strong>Completed On:</strong></Label>
                    <Input type="date"
                        className="goal-input"
                        id="completed_on"
                        required
                        onChange={handleFieldChange}
                    />
                </FormGroup>

                <FormGroup className="goal-form-button-container">                       
                    <Button type="button" disabled={isLoading} className="goal-form-button completed-goal-form-add-button" onClick={updateCompletedGoal}>Add</Button>
                    <Button type="button" disabled={isLoading} className="goal-form-button goal-form-no-thanks-button" onClick={updateCompletedGoal}>No Thanks</Button>
                </FormGroup>
            </Form>
        </>
    )
};

export default GoalCompleteForm