import React from 'react';
import './Gym.css';
import { Card, Button, CardTitle } from 'reactstrap';

const GymCard = (props) => {

    // returns a card for each gym created by the user
    // each card includes the gym name and 'edit' & 'delete' buttons
    return (
        <div className="gym-card-div">

            <Card body className="text-center gym-card">

                <div className="gym-card-content">
                    {/* returns the gym name */}
                    <CardTitle className="gym-name"><strong>Gym Name:</strong> {props.gym.name}</CardTitle>
                </div>

                <div className="gym-card-buttons">
                    {/* when the 'edit' button is clicked, re-direct to the 'edit gym' form */}
                    <Button type="button" className="gym-button edit-gym-button" size="sm" onClick={() => props.history.push(`/gyms/${props.gym.id}/edit`)}>Edit</Button>
                    {/* when the 'delete' button is clicked, execute the handleGymDelete function in GymList.js */}
                    <Button type="button" className="gym-button delete-gym-button" size="sm" onClick={() => { props.handleGymDelete(props.gym.id) }}>Delete</Button>
                </div>

            </Card>

        </div>
    );
};

export default GymCard;