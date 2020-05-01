import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

const GoalEditForm = (props) => {

    // gets the logged in users info and prepares to set the selected goal in state
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: "", completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // listens to what the user inputs into the form fields in real time and sets the goal info in state
    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    // constructs an updated goal object, saves it to the database, an re-directs to the main goal list
    const updateExistingGoal = (evt) => {
        evt.preventDefault();
        // the goal and complete by date mus be filled out
        if (goal.goal_content === "" || goal.complete_by === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            // uses moment.js to convert dates to MM/DD/YYYY format
            // if the completed on date is blank, save an empty string
            // if the completed on date is specified, save the completed on date
            const editedGoal = {
                id: parseInt(props.match.params.goalId),
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: moment(goal.complete_by).format('L'),
                is_complete: goal.is_complete,
                completed_on: goal.completed_on === "" ? "" : moment(goal.completed_on).format('L')
            };

            GoalApiManager.putGoal(editedGoal)
                .then(() => props.history.push("/goals"));
        };
    };

    // gets the info about the selected goal from the database, sets the goal info in state, and pre-loads the info into the form fields after the initial page render
    useEffect(() => {
        GoalApiManager.getGoalById(props.match.params.goalId)
            .then(goal => {

                // uses moment.js to convert dates back to the default format to pre-fill form fields
                const completeByFormatted = moment(goal.complete_by).format().split("T")[0]
                const completedOnFormatted = moment(goal.completed_on).format().split("T")[0]

                setGoal({
                    id: goal.id,
                    userId: goal.userId,
                    goal_content: goal.goal_content,
                    complete_by: completeByFormatted,
                    is_complete: goal.is_complete,
                    completed_on: goal.completed_on === "" ? "" : completedOnFormatted
                });
                setIsLoading(false)
            });
    }, []);

     // returns the 'edit goal' form with inputs for the goal and complete by date and 'save' & 'cancel' buttons
    return (
        <>
            <Form className="edit-goal-form">

                {/* form header */}
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">Edit Goal</h2>
                </FormGroup>

                {/* goal input */}
                <FormGroup className="goal-form-input-container">
                    <Label htmlFor="goal_content" className="goal-label"><strong>Goal:</strong></Label>
                    <Input type="text"
                        className="goal-input"
                        id="goal_content"
                        required
                        value={goal.goal_content}
                        onChange={handleFieldChange}
                    />

                    {/* complete by date input */}
                    <Label htmlFor="complete_by" className="goal-label"><strong>Complete By:</strong></Label>
                    <Input type="date"
                        className="goal-input"
                        id="complete_by"
                        required
                        value={goal.complete_by}
                        onChange={handleFieldChange}
                    />

                    {/* if the goal is complete, return a completed on input with the date pre-filled */}
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
                    {/* when the 'save' button is clicked, execute the updateExistingGoal function */}
                    <Button type="button" disabled={isLoading} className="goal-form-button goal-form-save-button" onClick={updateExistingGoal}>Save</Button>
                    {/* when the 'cancel' button is clicked, re-direct to the main goal list page */}
                    <Button type="button" className="goal-form-button goal-form-cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GoalEditForm;