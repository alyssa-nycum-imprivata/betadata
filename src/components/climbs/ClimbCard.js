import React from 'react';
import './Climb.css';


const ClimbCard = (props) => {
    return (
        <div className="card climb-card">
            <div className="card-content climb-card-content">
                <h3>Type: {props.climb.type}</h3>
                <h3>Grade: {props.climb.grade}</h3>
                <h3>Description: {props.climb.description}</h3>
                <button type="button" className="button add-attempt-button">Add Attempt</button>
                <h3>Beta/Comments: {props.climb.beta_comments}</h3>
                <h3>Enjoyment Rating: {props.climb.rating}</h3>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button edit-button">Edit</button>
                <button type="button" className="button archive-button">Archive</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleDelete(props.climb.id);
                }}>Delete</button>
            </div>
        </div>
    )
};

export default ClimbCard;