import React, { useState, useEffect } from 'react';
import './Goal.css';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

const GoalCard = (props) => {
    const [backgroundColor, setBackgroundColor] = useState();

    useEffect(() => {
        if (props.goal.is_complete === true) {
            setBackgroundColor({ backgroundColor: '#9AD2CB' })
        } else {
            setBackgroundColor({ backgroundColor: '#ECE2D0' })
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
            setBackgroundColor({ backgroundColor: '#C19070' })
        }
    }, [props.goal.complete_by, props.goal.is_complete]);

    return (
        <div className="goal-card-div">
            <Card body className="text-center goal-card" style={backgroundColor}>
                <div className="goal-card-content">
                    <CardTitle className="goal-title"><strong>Goal:</strong> {props.goal.goal_content}</CardTitle>
                    <CardText className="goal-date"><strong>Complete By:</strong> {props.goal.complete_by}</CardText>
                    {props.goal.is_complete === true && props.goal.completed_on !== "" ? <CardText className="goal-date"><strong>Completed On:</strong> {props.goal.completed_on}</CardText> : null}
                </div>
                <div className="goal-card-buttons">
                    <div className="complete-buttons">
                        {props.goal.is_complete === false ? <Button type="button" className="goal-button complete-button" size="sm" onClick={() => { props.history.push(`/goals/${props.goal.id}/complete`) }}>Mark Complete</Button> : null}
                        {props.goal.is_complete === true ? <Button type="button" className="goal-button uncomplete-button" size="sm" onClick={() => { props.handleUndoMarkComplete(props.goal.id) }}>Undo Mark Complete</Button> : null}
                    </div>
                    <div className="edit-delete-goal-buttons">
                        <Button type="button" className="goal-button edit-goal-button" size="sm" onClick={() => { props.history.push(`/goals/${props.goal.id}/edit`) }}>Edit</Button>
                        <Button type="button" className="goal-button delete-goal-button" size="sm" onClick={() => {
                            props.handleGoalDelete(props.goal.id);
                        }}>Delete</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GoalCard;