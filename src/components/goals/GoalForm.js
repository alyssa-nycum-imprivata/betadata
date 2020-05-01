import React, { useState } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

const GoalForm = (props) => {

    // gets the logged in users info and prepares to set the new goal in state
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: false, completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // listens to what the user inputs into the form fields in real time and sets the goal info in state
    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    // constructs a new goal object, saves it to the database, and re-directs to the main goal list
    const constructNewGoal = (evt) => {
        evt.preventDefault();
        // the goal and complete by date must be filled out
        if (goal.goal_content === "" || goal.complete_by === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true)

            // uses moment.js to convert dates to MM/DD/YYYY format
            const newGoal = {
                id: props.match.params.goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: moment(goal.complete_by).format('L'),
                is_complete: false,
                completed_on: ""
            };

            GoalApiManager.postGoal(newGoal).then(() => props.history.push("/goals"));
        };
    };

     // returns the 'add a new goal' form with inputs for the goal & complete by date and 'add' & 'cancel' buttons
    return (
        <>
            <Form className="new-goal-form">

                {/* form header */}
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">Add a New Goal</h2>
                </FormGroup>

                {/* goal input */}
                <FormGroup className="goal-form-input-container">
                    <Label htmlFor="goal_content" className="goal-label"><strong>Goal:</strong></Label>
                    <Input type="text"
                        className="goal-input"
                        id="goal_content"
                        required
                        onChange={handleFieldChange}
                    />

                    {/* complete by date input */}
                    <Label htmlFor="complete_by" className="goal-label"><strong>Complete By:</strong></Label>
                    <Input type="date"
                        className="goal-input"
                        id="complete_by"
                        required
                        onChange={handleFieldChange}
                    />
                </FormGroup>

                <FormGroup className="goal-form-button-container">
                    {/* when the 'add' button is clicked, execute the constructNewGoal function */}
                    <Button type="button" className="goal-form-button goal-form-add-button" disabled={isLoading} onClick={constructNewGoal}>Add</Button>
                    {/* when the 'cancel' button is clicked, re-direct to the main goal list page */}
                    <Button type="button" className="goal-form-button goal-form-cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</Button>
                </FormGroup>
                
            </Form>
        </>
    );
};

export default GoalForm;

