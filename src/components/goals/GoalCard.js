import React from 'react';

const GoalCard = (props) => {
    return (
        <div className="card goal-card">
            <div className="card-content goal-card-content">
                <h3>Goal: {props.goal.goal_content}</h3>
                <h3>Complete By: {props.goal.complete_by}</h3>
                <h3>Completed?: <input type="checkbox" /> <label>Yes</label></h3>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button edit-button">Edit</button>
                <button type="button" className="button delete-button">Delete</button>
            </div>
        </div>
    );
};

export default GoalCard;