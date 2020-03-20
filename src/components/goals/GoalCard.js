import React from 'react';

const GoalCard = (props) => {
    return (
        <div className="card goal-card">
            <div className="card-content goal-card-content">
                <h3>Goal: {props.goal.goal_content}</h3>
                <h3>Complete By: {props.goal.complete_by}</h3>
                <h3>Completed?:</h3> <input type="checkbox" id="is_complete" value={props.goal.is_complete} defaultChecked={props.goal.is_complete} onChange={() => props.toggleCompletedCheckbox(props.goal.id)}/> <label htmlFor="is_complete">Yes</label>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button edit-button" onClick={() => { props.history.push(`/goals/${props.goal.id}/edit`) }}>Edit</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleGoalDelete(props.goal.id);
                }}>Delete</button>
            </div>
        </div>
    );
};

export default GoalCard;