import React, { useState, useEffect } from 'react';
import './Gym.css';
import GymApiManager from '../../modules/GymApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const GymEditForm = (props) => {
    const [gym, setGym] = useState({ userId: "", name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...gym };
        stateToChange[evt.target.id] = evt.target.value;
        setGym(stateToChange);
    };

    const updateExistingGym = (evt) => {
        evt.preventDefault();
        if (gym.name === "") {
            window.alert("Please fill out gym name");
        } else {
            setIsLoading(true);

            const editedGym = {
                id: parseInt(props.match.params.gymId),
                userId: activeUserId,
                name: gym.name
            };

            GymApiManager.putGym(editedGym).then(() => props.history.push("/gyms"));
        };
    };

    useEffect(() => {
        GymApiManager.getGymById(props.match.params.gymId)
            .then(gym => {
                setGym(gym);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <Form className="edit-gym-form">
                <FormGroup className="gym-form-header-container">
                    <h2 className="gym-form-header">Edit Gym</h2>
                </FormGroup>
                <FormGroup className="gym-form-input-container">
                    <Label htmlFor="name" className="gym-label"><strong>Gym Name:</strong></Label>
                    <Input type="text"
                        className="gym-input"
                        id="name"
                        required
                        value={gym.name}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup className="gym-form-button-container">
                    <Button type="button" className="gym-form-button gym-form-save-button" disabled={isLoading} onClick={updateExistingGym}>Save</Button>
                    <Button type="button" className="gym-form-button gym-form-cancel-button" onClick={() => {props.history.push("/gyms")}}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GymEditForm;