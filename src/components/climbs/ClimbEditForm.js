import React, { useState, useEffect } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

const ClimbEditForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const updateExistingClimb = (evt) => {
        evt.preventDefault();
        if (climb.type === "" || climb.grade === "" || climb.rating === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const editedClimb = {
                id: parseInt(props.match.params.climbId),
                userId: activeUserId,
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
                            {climb.type === "Top Rope" ?
                                <>
                                    <Label htmlFor="grade" className="climb-label"><strong>*Grade:</strong></Label>
                                    <div className="grade-input-prefix-div">
                                        <h6 className="grade-input-prefix">5.</h6><Input bsSize="sm" type="text"
                                            id="grade"
                                            className="climb-input"
                                            value={climb.grade}
                                            required
                                            onChange={handleFieldChange}
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
                                            id="grade"
                                            className="climb-input"
                                            required
                                            value={climb.grade}
                                            onChange={handleFieldChange}
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
                                            id="grade"
                                            className="climb-input"
                                            required
                                            value={climb.grade}
                                            onChange={handleFieldChange}
                                        />
                                    </div>
                                </>
                                : null
                            }
                        </div>
                    </div>

                    <Label htmlFor="description" className="climb-label"><strong>Description:</strong></Label>
                    <Input bsSize="sm" type="textarea"
                        id="description"
                        className="climb-input"
                        required
                        rows="2"
                        value={climb.description}
                        onChange={handleFieldChange}
                        placeholder="ex. color, rope #, wall, starting holds, etc."
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