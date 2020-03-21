import React from 'react';

const GoalCard = (props) => {

    // -----ADD UNDO MARK COMPLETE FUNCTIONALITY-----

    return (
        <div className="card goal-card">
            <div className="card-content goal-card-content">
                <h3>Goal: {props.goal.goal_content}</h3>
                <h3>Complete By: {props.goal.complete_by}</h3>
                {props.goal.is_complete === true && props.goal.completed_on !== "" ? <h3>Completed On: {props.goal.completed_on}</h3> : null}
            </div>
            <div className="card-buttons-container">
                {props.goal.is_complete === false ? <button type="button" className="button" onClick={() => { props.history.push(`/goals/${props.goal.id}/complete`) }}>Mark Complete</button> : <button type="button" className="button">Undo Mark Complete</button>}
                <button type="button" className="button edit-button" onClick={() => { props.history.push(`/goals/${props.goal.id}/edit`) }}>Edit</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleGoalDelete(props.goal.id);
                }}>Delete</button>
            </div>
        </div>
    );
};

export default GoalCard;