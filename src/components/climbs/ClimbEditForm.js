import React, { useState, useEffect } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";
import GymApiManager from '../../modules/GymApiManager';

const ClimbEditForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", gymId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);
    const [gyms, setGyms] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const updateExistingClimb = (evt) => {
        evt.preventDefault();
        if (climb.gymId === "" || climb.type === "" || climb.grade === "" || climb.rating === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const editedClimb = {
                id: parseInt(props.match.params.climbId),
                userId: activeUserId,
                gymId: parseInt(climb.gymId),
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: parseInt(climb.rating),
                created_on: moment().format('L') + " " + moment().format('LTS'),
                is_archived: false
            };

            ClimbApiManager.putClimb(editedClimb)
                .then(() => props.history.push("/climbs"));
        };
    };

    useEffect(() => {
        ClimbApiManager.getClimbById(props.match.params.climbId)
            .then(climb => {
                setClimb(climb);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        GymApiManager.getGymsByUser(activeUserId).then(gyms => {
            setGyms(gyms);
            setIsLoading(false)
        })
    }, []);

    return (
        <>
            <Form className="edit-climb-form">
                <FormGroup className="climb-form-header-container">
                    <h2 className="climb-form-header">Edit Climb</h2>
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
                                onChange={handleFieldChange}
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
                                onChange={handleFieldChange}
                            >
                                <option value="" disabled defaultValue>Select</option>
                                <option value="Top Rope">Top Rope</option>
                                <option value="Lead">Lead</option>
                                <option value="Boulder">Boulder</option>
                            </Input>
                        </div>

                        <div className="grade-div">
                            {climb.type === "Top Rope" || climb.type === "Lead" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <Input bsSize="sm" type="select"
                                            id="grade"
                                            className="climb-input"
                                            value={climb.grade}
                                            required
                                            onChange={handleFieldChange}
                                        >
                                            <option value="" disabled defaultValue>Select</option>
                                            <option value="5">5.5</option>
                                            <option value="6">5.6</option>
                                            <option value="7">5.7</option>
                                            <option value="8">5.8</option>
                                            <option value="9">5.9</option>
                                            <option value="10-">5.10-</option>
                                            <option value="10+">5.10+</option>
                                            <option value="11-">5.11-</option>
                                            <option value="11+">5.11+</option>
                                            <option value="12-">5.12-</option>
                                            <option value="12+">5.12+</option>
                                            <option value="13">5.13-</option>
                                        </Input>
                                    </div>
                                </>
                                : null
                            }

                            {climb.type === "Boulder" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <Input bsSize="sm" type="select"
                                            id="grade"
                                            className="climb-input"
                                            required
                                            value={climb.grade}
                                            onChange={handleFieldChange}
                                        >
                                            <option value="" disabled defaultValue>Select</option>
                                            <option value="0">V0</option>
                                            <option value="1">V1</option>
                                            <option value="2">V2</option>
                                            <option value="3">V3</option>
                                            <option value="4">V4</option>
                                            <option value="5">V5</option>
                                            <option value="6">V6</option>
                                            <option value="7">V7</option>
                                            <option value="8">V8</option>
                                            <option value="9">V9</option>
                                            <option value="10">V10</option>
                                        </Input>
                                    </div>
                                </>
                                : null
                            }
                        </div>
                    </div>

                    <Label htmlFor="description" className="climb-label"><strong>Description:</strong></Label>
                    <h6 className="description-example">example: color, rope #, wall, starting holds, etc.</h6>
                    <Input bsSize="sm" type="textarea"
                        id="description"
                        className="climb-input"
                        required
                        rows="2"
                        value={climb.description}
                        onChange={handleFieldChange}
                    />

                    <Label htmlFor="beta_comments" className="climb-label"><strong>Beta/Comments:</strong></Label>
                    <Input bsSize="sm" type="textarea"
                        id="beta_comments"
                        className="climb-input"
                        required
                        rows="2"
                        value={climb.beta_comments}
                        onChange={handleFieldChange}
                    />

                    <Label htmlFor="rating" className="climb-label"><strong>*Enjoyment Rating:</strong></Label>
                    <Input bsSize="sm" id="rating"
                        type="select"
                        className="climb-input"
                        required
                        value={climb.rating}
                        name="rating"
                        onChange={handleFieldChange}
                    >
                        <option value="" disabled defaultValue>Select</option>
                        <option value="1">1 star</option>
                        <option value="2">2 stars</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                    </Input>
                </FormGroup>

                <FormGroup className="climb-form-button-container">
                    <Button type="button"
                        className="climb-form-button climb-form-save-button"
                        disabled={isLoading} onClick={updateExistingClimb}>Save</Button>
                    <Button type="button" className="climb-form-button climb-form-cancel-button"
                        onClick={() => { props.history.push("/climbs") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default ClimbEditForm;