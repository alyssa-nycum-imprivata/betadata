import React, { useState } from 'react';
import './Gym.css';
import GymApiManager from '../../modules/GymApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const GymForm = (props) => {
    const [gym, setGym] = useState({ userId: "", name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...gym };
        stateToChange[evt.target.id] = evt.target.value;
        setGym(stateToChange);
    };

    const constructNewGym = (evt) => {
        evt.preventDefault();
        if (gym.name === "") {
            window.alert("Please fill out gym name");
        } else {
            setIsLoading(true);

            const newGym = {
                id: props.match.params.gymId,
                userId: activeUserId,
                name: gym.name
            };

            GymApiManager.postGym(newGym).then(() => props.history.push("/gyms"));
        };
    };

    return (
        <>
            <Form className="new-gym-form">
                <FormGroup className="gym-form-header-container">
                    <h2 className="gym-form-header">Add a New Gym</h2>
                </FormGroup>
                <FormGroup className="gym-form-input-container">
                    <Label htmlFor="name" className="gym-label"><strong>Gym Name:</strong></Label>
                    <Input type="text"
                        className="gym-input"
                        id="name"
                        required
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup className="gym-form-button-container">
                    <Button type="button" className="gym-form-button gym-form-add-button" disabled={isLoading} onClick={constructNewGym}>Add</Button>
                    <Button type="button" className="gym-form-button gym-form-cancel-button" onClick={() => {props.history.push("/climbs")}}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GymForm;