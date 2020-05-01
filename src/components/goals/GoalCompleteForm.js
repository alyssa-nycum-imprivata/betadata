import React, { useState, useEffect } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

const GoalCompleteForm = (props) => {

     // gets the logged in users info and prepares to set the selected goal in state
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: false, completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // listens to what the user inputs into the form fields in real time and sets the goal info in state
    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    // constructs an updated goal object where is complete is set to true, saves it to the database, and re-directs to the main goal list page
    const updateCompletedGoal = (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        // uses moment.js to convert dates to MM/DD/YYYY format
        // if the completed on date is blank (it's an option field, the user can choose not to enter a date), save an empty string
        // if the completed on date is specified, save the completed on date
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

     // gets the info about the selected goal from the database and sets the goal info in state after the initial page render
    useEffect(() => {
        GoalApiManager.getGoalById(props.match.params.goalId)
            .then(goal => {
                setGoal(goal);
                setIsLoading(false)
            });
    }, []);

    // returns the 'goal completed' form with an input for a completed on date (optional) and 'add' & 'no thanks' buttons
    return (
        <>
            <Form className="completed-goal-form">
                {/* form header */}
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">GOAL COMPLETED!</h2>
                </FormGroup>

                {/* subtext explaining the completed on date is optional */}
                <FormGroup className="goal-form-note-container">
                    <h6>Add an optional 'completed on' date below</h6>
                </FormGroup>

                {/* completed on date input */}
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
                    {/* when the 'add' button is clicked, execute the updateCompletedGoal function */}
                    <Button type="button" disabled={isLoading} className="goal-form-button completed-goal-form-add-button" onClick={updateCompletedGoal}>Add</Button>
                    {/* when the 'no thanks' button is clicked, execute the updateCompletedGoal function */}
                    <Button type="button" disabled={isLoading} className="goal-form-button goal-form-no-thanks-button" onClick={updateCompletedGoal}>No Thanks</Button>
                </FormGroup>
            </Form>
        </>
    )
};

export default GoalCompleteForm