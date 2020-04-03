import React, { useState, useEffect } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import AttemptApiManager from '../../modules/AttemptApiManager';
import './Climb.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";
import GymApiManager from '../../modules/GymApiManager';

const ClimbForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", gymId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", is_flashed: "", number_of_falls: 0, number_of_attempts: 0, is_clean: "", created_on: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [gyms, setGyms] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleClimbFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const handleAttemptFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    useEffect(() => {
        GymApiManager.getGymsByUser(activeUserId).then(gyms => {
            setGyms(gyms);
            setIsLoading(false)
        })
    }, []);

    const constructNewClimbWithFirstAttempt = (evt) => {
        evt.preventDefault();
        if (climb.gymId === "" || climb.type === "" || climb.grade === "" || climb.rating === "" || attempt.attempt_date === "" || attempt.is_flashed === "") {
            window.alert("Please fill out required fields");
        } else if (attempt.is_flashed === "false" && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not flashed, please enter at least 1 fall.");
        } else if (attempt.is_flashed === "false" && attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt");
        } else if (attempt.is_flashed === "false" && attempt.is_clean === "" && climb.type === "Boulder") {
            window.alert("Please select if climb was cleaned or not.");
        } else {
            setIsLoading(true);

            const newClimb = {
                id: props.match.params.climbId,
                userId: activeUserId,
                gymId: climb.gymId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: parseInt(climb.rating),
                created_on: moment().format('L') + " " + moment().format('LTS'),
                is_archived: false
            };

            if (attempt.is_clean !== "") {
                attempt.is_clean = JSON.parse(attempt.is_clean)
            }

            if (climb.type === "Boulder" && attempt.is_clean === true) {
                attempt.number_of_falls = (attempt.number_of_attempts - 1)
            }

            if (climb.type === "Boulder" && attempt.is_clean === false) {
                attempt.number_of_falls = attempt.number_of_attempts
            }

            if (attempt.is_flashed === "true") {
                attempt.number_of_falls = 0;
                attempt.number_of_attempts = 1;
                attempt.is_clean = "";
            }

            if (climb.type === "Top Rope" || climb.type === "Lead") {
                attempt.number_of_attempts = 1;
            }

            const newAttempt = {
                id: props.match.params.attemptId,
                attempt_date: moment(attempt.attempt_date).format('L'),
                number_of_falls: parseInt(attempt.number_of_falls),
                number_of_attempts: parseInt(attempt.number_of_attempts),
                is_flashed: JSON.parse(attempt.is_flashed),
                is_clean: attempt.is_clean,
                created_on: moment().format('L') + " " + moment().format('LTS')
            }

            ClimbApiManager.postClimb(newClimb)
                .then(climbData => {
                    newAttempt.climbId = climbData.id
                    AttemptApiManager.postAttempt(newAttempt)
                        .then(() => props.history.push("/climbs"));
                })
        }
    };

    return (
        <>
            <Form className="new-climb-form">
                <FormGroup className="climb-form-header-container">
                    <h2 className="climb-form-header">Add a New Climb</h2>
                </FormGroup>
                <FormGroup className="climb-form-note-container">
                    <h6>Fields marked with * are required</h6>
                </FormGroup>
                <FormGroup className="climb-form-input-container">
                    <div className="type-grade-div">
                        <div className="gym-div">
                            <Label htmlFor="gymId" className="climb-label"><strong>*Gym:</strong></Label>
                            <Input bsSize="sm" id="gymId"
                                type="select"
                                className="climb-input"
                                required
                                value={climb.gymId}
                                name="gymId"
                                onChange={handleClimbFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                {gyms.map(gym =>
                                    <option key={gym.id} value={gym.id}>{gym.name}</option>
                                )}
                            </Input>
                        </div>
                        <div className="type-div">
                            <Label htmlFor="type" className="climb-label"><strong>*Type:</strong></Label>
                            <Input bsSize="sm" id="type"
                                type="select"
                                className="climb-input"
                                required
                                value={climb.type}
                                name="type"
                                onChange={handleClimbFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="Top Rope">Top Rope</option>
                                <option value="Lead">Lead</option>
                                <option value="Boulder">Boulder</option>
                            </Input>
                        </div>
                        <div className="grade-div">
                            {climb.type === "Top Rope" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <h6 className="grade-input-prefix">5.</h6><Input bsSize="sm" type="text"
                                            className="climb-input"
                                            id="grade"
                                            required
                                            onChange={handleClimbFieldChange}
                                        />
                                    </div>
                                </>
                                : null
                            }

                            {climb.type === "Lead" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <h6 className="grade-input-prefix">5.</h6><Input bsSize="sm" type="text"
                                            className="climb-input"
                                            id="grade"
                                            required
                                            onChange={handleClimbFieldChange}
                                        />
                                    </div>
                                </>
                                : null
                            }

                            {climb.type === "Boulder" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <h6 className="grade-input-prefix">V</h6><Input bsSize="sm" type="text"
                                            className="climb-input"
                                            id="grade"
                                            required
                                            onChange={handleClimbFieldChange}
                                        />
                                    </div>
                                </>
                                : null
                            }
                        </div>
                    </div>

                    {climb.type === "" ? null :
                        <>
                            <Label htmlFor="description" className="climb-label"><strong>Description:</strong></Label>
                            <h6 className="description-example">example: color, rope #, wall, starting holds, etc.</h6>
                            <Input bsSize="sm" type="textarea"
                                id="description"
                                className="climb-input"
                                rows="2"
                                onChange={handleClimbFieldChange}
                            />

                            <Label htmlFor="attempt_date" className="climb-label"><strong>*Attempt Date:</strong></Label>
                            <Input bsSize="sm" type="date"
                                className="climb-input"
                                id="attempt_date"
                                required
                                onChange={handleAttemptFieldChange}
                            />

                            <div className="attempt-div">
                                <div className="flashed-div">
                                    <Label htmlFor="is_flashed" className="climb-label"><strong>*Flashed?:</strong></Label>
                                    <Input bsSize="sm" id="is_flashed"
                                        type="select"
                                        className="climb-input"
                                        required
                                        value={attempt.is_flashed}
                                        name="is_flashed"
                                        onChange={handleAttemptFieldChange}
                                    >
                                        <option value="" disabled defaultValue>Select</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Input>
                                </div>

                                <div className="falls-div">
                                    {(attempt.is_flashed === "false" && (climb.type === "Top Rope" || climb.type === "Lead")) ?
                                        <>
                                            <Label htmlFor="number_of_falls" className="climb-label"><strong>*Number of Falls:</strong></Label>
                                            <Input bsSize="sm" type="number"
                                                className="climb-input"
                                                id="number_of_falls"
                                                required
                                                onChange={handleAttemptFieldChange}
                                            />
                                        </>
                                        : null
                                    }
                                </div>

                                {(attempt.is_flashed === "false" && climb.type === "Boulder") ?
                                    <>
                                        <div className="attempts-div">
                                            <Label htmlFor="number_of_attempts" className="climb-label"><strong>*Number of Attempts:</strong></Label>
                                            <Input bsSize="sm" type="number"
                                                className="climb-input"
                                                id="number_of_attempts"
                                                required
                                                onChange={handleAttemptFieldChange}
                                            />
                                        </div>
                                        <div className="clean-div">
                                            <Label htmlFor="is_clean" className="climb-label"><strong>*Cleaned?:</strong></Label>
                                            <Input bsSize="sm" id="is_clean"
                                                type="select"
                                                className="climb-input"
                                                required
                                                value={attempt.is_clean}
                                                name="is_clean"
                                                onChange={handleAttemptFieldChange}
                                            >
                                                <option value="" disabled defaultValue>Select</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Input>
                                        </div>
                                    </>
                                    : null
                                }
                            </div>

                            <Label htmlFor="beta_comments" className="climb-label"><strong>Beta/Comments:</strong></Label>
                            <Input bsSize="sm" type="textarea"
                                className="climb-input"
                                id="beta_comments"
                                rows="2"
                                onChange={handleClimbFieldChange}
                            />

                            <Label htmlFor="rating" className="climb-label"><strong>*Enjoyment Rating:</strong></Label>
                            <Input bsSize="sm" id="rating"
                                type="select"
                                className="climb-input"
                                required
                                value={climb.rating}
                                name="rating"
                                onChange={handleClimbFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="1">1 star</option>
                                <option value="2">2 stars</option>
                                <option value="3">3 stars</option>
                                <option value="4">4 stars</option>
                                <option value="5">5 stars</option>
                            </Input>
                        </>
                    }
                </FormGroup>

                <FormGroup className="climb-form-button-container">
                    {climb.type === "" ? null :
                        <Button type="button"
                            className="climb-form-button climb-form-add-button"
                            disabled={isLoading}
                            onClick={constructNewClimbWithFirstAttempt}
                        >Add</Button>
                    }
                    <Button type="button"
                        className="climb-form-button climb-form-cancel-button"
                        onClick={() => { props.history.push("/climbs") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default ClimbForm;





