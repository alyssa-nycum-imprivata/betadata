import React, { useState, useEffect } from 'react';
import './Goal.css';
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import * as moment from "moment";

const GoalCard = (props) => {

    // preparing to set background color in state
    const [backgroundColor, setBackgroundColor] = useState();

    // if the goal is complete, the background color will be set to middle-blue-green
    // if the goal is not complete, the background color will be set to almond
    useEffect(() => {
        if (props.goal.is_complete === true) {
            setBackgroundColor({ backgroundColor: '#9AD2CB' })
        } else {
            setBackgroundColor({ backgroundColor: '#ECE2D0' })
        }
    }, [props.goal.is_complete]);

    // if the goal is incomplete and the complete by date is past due, the background color will be set to deep taupe
    // uses moment.js to convert dates to MM/DD/YYYY format in ordered to be compared
    useEffect(() => {
        const currentDate = moment().format('L')
        if (props.goal.complete_by < currentDate && props.goal.is_complete === false) {
            setBackgroundColor({ backgroundColor: '#C19070' })
        }
    }, [props.goal.complete_by, props.goal.is_complete]);

    // returns a card for each goal created by the user
    // each card includes the goal & the complete by date and 'mark complete/undo mark complete', 'edit' & 'delete' buttons
    return (
        <div className="goal-card-div">

            <Card body className="text-center goal-card" style={backgroundColor}>

                <div className="goal-card-content">
                    {/* returns the goal */}
                    <CardTitle className="goal-title"><strong>Goal:</strong> {props.goal.goal_content}</CardTitle>
                    {/* returns the complete by date */}
                    <CardText className="goal-date"><strong>Complete By:</strong> {props.goal.complete_by}</CardText>
                    {/* if the goal is complete and the user provides a completed on date, return the completed on date on the card */}
                    {props.goal.is_complete === true && props.goal.completed_on !== "" ? <CardText className="goal-date"><strong>Completed On:</strong> {props.goal.completed_on}</CardText> : null}
                </div>

                <div className="goal-card-buttons">

                    <div className="complete-buttons">
                        {/* if the goal is not complete, return a 'mark complete button' and if the 'mark complete button is clicked, re-direct to the 'goal completed form' */}
                        {props.goal.is_complete === false ? <Button type="button" className="goal-button complete-button" size="sm" onClick={() => { props.history.push(`/goals/${props.goal.id}/complete`) }}>Mark Complete</Button> : null}
                        {/* if the goal is complete, return a 'undo mark complete' button and if the 'undo mark complete' button is clicked, execute the handleUndoMarkComplete function in GoalList.js */}
                        {props.goal.is_complete === true ? <Button type="button" className="goal-button uncomplete-button" size="sm" onClick={() => { props.handleUndoMarkComplete(props.goal.id) }}>Undo Mark Complete</Button> : null}
                    </div>

                    <div className="edit-delete-goal-buttons">
                        {/* when the 'edit' button is clicked, re-direct to the 'edit goal' form */}
                        <Button type="button" className="goal-button edit-goal-button" size="sm" onClick={() => { props.history.push(`/goals/${props.goal.id}/edit`) }}>Edit</Button>
                        {/* when the 'delete' button is clicked, execute the handleGoalDelete function in GoalList.js */}
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