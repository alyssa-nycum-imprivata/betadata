import React, { useState, useEffect } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';
import ClimbApiManager from '../../modules/ClimbApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './Attempt.css';
import * as moment from "moment";

const AttemptForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, number_of_attempts: 0, is_flashed: "", is_clean: "", created_on: "" });
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    useEffect(() => {
        ClimbApiManager.getClimbById(props.match.params.climbId)
            .then(climb => {
                setClimb(climb);
                setIsLoading(false);
            });
    }, []);

    const constructNewAttempt = (evt) => {
        evt.preventDefault();
        if (attempt.attempt_date === "" || attempt.is_clean === "") {
            window.alert("Please fill out all fields.")
        } else if (attempt.is_clean === "false" && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not cleaned, please enter at least 1 fall.")
        } else if (attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt.")
        } else {
            setIsLoading(true);

            if (climb.type === "Boulder" && attempt.is_clean === "true") {
                attempt.number_of_falls = (attempt.number_of_attempts - 1)
            }

            if (climb.type === "Boulder" && attempt.is_clean === "false") {
                attempt.number_of_falls = attempt.number_of_attempts
            }

            if (attempt.is_clean === "true" && (climb.type === "Top Rope" || climb.type === "Lead")) {
                attempt.number_of_falls = 0;
            }

            const newAttempt = {
                id: props.match.params.attemptId,
                climbId: parseInt(props.match.params.climbId),
                attempt_date: moment(attempt.attempt_date).format('L'),
                number_of_falls: parseInt(attempt.number_of_falls),
                number_of_attempts: parseInt(attempt.number_of_attempts),
                is_flashed: attempt.is_flashed,
                is_clean: JSON.parse(attempt.is_clean),
                created_on: moment().format('L') + " " + moment().format('LTS'),
            };

            AttemptApiManager.postAttempt(newAttempt)
                .then(() => props.history.push("/climbs"));
        }
    };

    return (
        <>
            <Form className="new-attempt-form">
                <FormGroup className="attempt-form-header-container">
                    <h2 className="attempt-form-header">Add a New Attempt</h2>
                </FormGroup>
                <FormGroup className="attempt-form-input-container">
                    <Label htmlFor="attempt_date" className="new-attempt-label"><strong>Attempt Date:</strong></Label>
                    <Input type="date"
                        className="new-attempt-input"
                        id="attempt_date"
                        required
                        onChange={handleFieldChange}
                    />

                    {(climb.type === "Boulder") ?
                        <>
                            <Label htmlFor="number_of_attempts" className="new-attempt-label"><strong>Number of Attempts:</strong></Label>
                            <Input type="number"
                                className="new-attempt-input"
                                id="number_of_attempts"
                                required
                                onChange={handleFieldChange}
                            />
                        </>
                        : null
                    }

                    <Label htmlFor="is_clean" className="new-attempt-label"><strong>Cleaned?:</strong></Label>
                    <Input id="is_clean"
                        type="select"
                        className="new-attempt-input"
                        required
                        value={attempt.is_clean}
                        name="is_clean"
                        onChange={handleFieldChange}
                    >
                        <option value="" disabled defaultValue>Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Input>

                    {(attempt.is_clean === "false" && (climb.type === "Top Rope" || climb.type === "Lead")) ?
                        <>
                            <Label htmlFor="number_of_falls" className="new-attempt-label"><strong>Number of Falls:</strong></Label>
                            <Input type="number"
                                className="new-attempt-input"
                                id="number_of_falls"
                                required
                                onChange={handleFieldChange}
                            />
                        </>
                        : null
                    }
                </FormGroup>

                <FormGroup className="attempt-form-button-container">
                    <Button type="button" className="attempt-form-button attempt-form-add-button" disabled={isLoading} onClick={constructNewAttempt}>Add</Button>
                    <Button type="button" className="attempt-form-button attempt-form-cancel-button" onClick={() => { props.history.push("/climbs") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default AttemptForm;