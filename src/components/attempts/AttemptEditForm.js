import React, { useState, useEffect } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';
import ClimbApiManager from '../../modules/ClimbApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './Attempt.css';
import * as moment from "moment";

const AttemptEditForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, number_of_attempts: 0, is_flashed: "", is_clean: "", created_on: "" });
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    const updateExistingAttempt = (evt) => {
        evt.preventDefault();
        if (attempt.attempt_date === "") {
            window.alert("Please fill out all fields.");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not flashed, please enter at least 1 fall.");
        } else if ((attempt.is_clean === "false" || attempt.is_clean === false) && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not cleaned, please enter at least 1 fall.");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.is_clean === "" && climb.type === "Boulder") {
            window.alert("Please select if climb was cleaned or not.");
        } else if (attempt.is_clean !== "" && attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt.");
        } else {

            setIsLoading(true);

            if (attempt.is_flashed !== "") {
                attempt.is_flashed = JSON.parse(attempt.is_flashed)
            }

            if (attempt.is_clean !== "") {
                attempt.is_clean = JSON.parse(attempt.is_clean)
            }

            if (climb.type === "Boulder" && (attempt.is_clean === "true" || attempt.is_clean === true)) {
                attempt.number_of_falls = (attempt.number_of_attempts - 1)
            }

            if (climb.type === "Boulder" && (attempt.is_clean === "false" || attempt.is_clean === false)) {
                attempt.number_of_falls = attempt.number_of_attempts
            }

            if (attempt.is_flashed === "true" || attempt.is_flashed === true) {
                attempt.number_of_falls = 0;
                attempt.number_of_attempts = 1;
                attempt.is_clean = "";
            }

            if (climb.type === "Top Rope" || climb.type === "Lead") {
                attempt.number_of_attempts = 1;
            }

            if ((attempt.is_clean === "true" || attempt.is_clean === true) && (climb.type === "Top Rope" || climb.type === "Lead")) {
                attempt.number_of_falls = 0
            }

            const editedAttempt = {
                id: props.match.params.attemptId,
                climbId: attempt.climbId,
                attempt_date: moment(attempt.attempt_date).format('L'),
                number_of_falls: parseInt(attempt.number_of_falls),
                number_of_attempts: parseInt(attempt.number_of_attempts),
                is_flashed: attempt.is_flashed,
                is_clean: attempt.is_clean,
                created_on: moment().format('L') + " " + moment().format('LTS'),
            };

            AttemptApiManager.putAttempt(editedAttempt)
                .then(() => props.history.push("/climbs"));
        }
    };

    useEffect(() => {
        AttemptApiManager.getAttemptById(props.match.params.attemptId)
            .then(attempt => {
                setAttempt(attempt);
                ClimbApiManager.getClimbById(attempt.climbId)
                    .then(climb => {
                        setClimb(climb);
                        setIsLoading(false);
                    });
            });
    }, []);

    return (
        <>
            <Form className="edit-attempt-form">
                <FormGroup className="attempt-form-header-container">
                    <h2 className="attempt-form-header">Edit Attempt</h2>
                </FormGroup>
                <FormGroup className="attempt-form-input-container">
                    <Label htmlFor="attempt_date" className="edit-attempt-label"><strong>Attempt Date:</strong></Label>
                    <Input type="date"
                        className="edit-attempt-input"
                        id="attempt_date"
                        required
                        value={attempt.attempt_date}
                        onChange={handleFieldChange}
                    />

                    {attempt.is_flashed !== "" && (climb.type === "Top Rope" || climb.type === "Lead") ?
                        <>
                            <Label htmlFor="is_flashed" className="edit-attempt-label"><strong>Flashed?:</strong></Label>
                            <Input id="is_flashed"
                                type="select"
                                className="edit-attempt-input"
                                required
                                value={attempt.is_flashed}
                                name="is_flashed"
                                onChange={handleFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Input>
                            {attempt.is_flashed === false || attempt.is_flashed === "false" ?
                                <>
                                    <Label htmlFor="number_of_falls" className="edit-attempt-label"><strong>Number of Falls:</strong></Label>
                                    <Input type="number"
                                        className="edit-attempt-input"
                                        id="number_of_falls"
                                        required
                                        value={attempt.number_of_falls}
                                        onChange={handleFieldChange}
                                    />
                                </>
                                : null}
                        </>
                        : null
                    }

                    {attempt.is_flashed !== "" && climb.type === "Boulder" ?
                        <>
                            <Label htmlFor="is_flashed" className="edit-attempt-label"><strong>Flashed?:</strong></Label>
                            <Input id="is_flashed"
                                type="select"
                                className="edit-attempt-input"
                                required
                                value={attempt.is_flashed}
                                name="is_flashed"
                                onChange={handleFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Input>
                            {attempt.is_flashed === "false" || attempt.is_flashed === false ?
                                <>
                                    <Label htmlFor="number_of_attempts" className="edit-attempt-label"><strong>Number of Attempts:</strong></Label>
                                    <Input type="number"
                                        className="edit-attempt-input"
                                        id="number_of_attempts"
                                        required
                                        value={attempt.number_of_attempts}
                                        onChange={handleFieldChange}
                                    />
                                    <Label htmlFor="is_clean" className="edit-attempt-label"><strong>Cleaned?:</strong></Label>
                                    <Input id="is_clean"
                                        type="select"
                                        className="edit-attempt-input"
                                        required
                                        value={attempt.is_clean}
                                        name="is_clean"
                                        onChange={handleFieldChange}
                                    >
                                        <option value="" disabled defaultValue>Select</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Input>
                                </>
                                : null}
                        </>
                        : null
                    }

                    {attempt.is_flashed === "" && (climb.type === "Top Rope" || climb.type === "Lead") ?
                        <>
                            <Label htmlFor="is_clean" className="edit-attempt-label"><strong>Cleaned?:</strong></Label>
                            <Input id="is_clean"
                                type="select"
                                className="edit-attempt-input"
                                required
                                value={attempt.is_clean}
                                name="is_clean"
                                onChange={handleFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Input>
                            {attempt.is_clean === "false" || attempt.is_clean === false ?
                                <>
                                    <Label htmlFor="number_of_falls" className="edit-attempt-label"><strong>Number of Falls:</strong></Label>
                                    <Input type="number"
                                        className="edit-attempt-input"
                                        id="number_of_falls"
                                        required
                                        value={attempt.number_of_falls}
                                        onChange={handleFieldChange}
                                    />
                                </>
                                : null}
                        </>
                        : null
                    }

                    {attempt.is_flashed === "" && climb.type === "Boulder" ?
                        <>
                            <Label htmlFor="number_of_attempts" className="edit-attempt-label"><strong>Number of Attempts:</strong></Label>
                            <Input type="number"
                                className="edit-attempt-input"
                                id="number_of_attempts"
                                required
                                value={attempt.number_of_attempts}
                                onChange={handleFieldChange}
                            />
                            <Label htmlFor="is_clean" className="edit-attempt-label"><strong>Cleaned?:</strong></Label>
                            <Input id="is_clean"
                                type="select"
                                className="edit-attempt-input"
                                required
                                value={attempt.is_clean}
                                name="is_clean"
                                onChange={handleFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Input>
                        </>
                        : null
                    }
                </FormGroup>

                <FormGroup className="attempt-form-button-container">
                    <Button type="button" className="attempt-form-button attempt-form-save-button" disabled={isLoading} onClick={updateExistingAttempt}>Save</Button>
                    <Button type="button" className="attempt-form-button attempt-form-cancel-button" onClick={() => { props.history.push("/climbs") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default AttemptEditForm;