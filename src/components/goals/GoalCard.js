import React, { useState, useEffect } from 'react';
import './Goal.css';

const GoalCard = (props) => {
    const [backgroundColor, setBackgroundColor] = useState();

    useEffect(() => {
        if (props.goal.is_complete === true) {
            setBackgroundColor({ backgroundColor: '#9AD2CB' })
        } else {
            setBackgroundColor({backgroundColor: '#ECE2D0'})
        }
    }, [props.goal.is_complete]);

    useEffect(() => {
        const localTime = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })
        let month = localTime.split("/")[0]
        if (month.length < 2) {
            month = "0" + month
        }
        let day = localTime.split("/")[1]
        if (day.length < 2) {
            day = "0" + day
        }
        let year = localTime.split("/")[2].split(",")[0]
        const currentDate = year + "-" + month + "-" + day
        if (props.goal.complete_by < currentDate && props.goal.is_complete === false) {
            setBackgroundColor({backgroundColor: '#C19070'})
        }
    }, [props.goal.complete_by, props.goal.is_complete]);

    return (
        <div className="card goal-card" style={backgroundColor}>
            <div className="card-content goal-card-content">
                <h3>Goal: {props.goal.goal_content}</h3>
                <h3>Complete By: {props.goal.complete_by}</h3>
                {props.goal.is_complete === true && props.goal.completed_on !== "" ? <h3>Completed On: {props.goal.completed_on}</h3> : null}
            </div>
            <div className="card-buttons-container">
                {props.goal.is_complete === false ? <button type="button" className="goal-button" onClick={() => { props.history.push(`/goals/${props.goal.id}/complete`) }}>Mark Complete</button> : null }
                {props.goal.is_complete === true ? <button type="button" className="goal-button" onClick={() => {
                    props.handleUndoMarkComplete(props.goal.id)
                }}>Undo Mark Complete</button> : null }
                <button type="button" className="button edit-button goal-button" onClick={() => { props.history.push(`/goals/${props.goal.id}/edit`) }}>Edit</button>
                <button type="button" className="button delete-button goal-button" onClick={() => {
                    props.handleGoalDelete(props.goal.id);
                }}>Delete</button>
            </div>
        </div>
    );
};

export default GoalCard;