import React, { useState, useEffect } from 'react';
import { Card, Button, CardText } from 'reactstrap';
import './Attempt.css';

const AttemptCard = (props) => {

    return (
        <div className="attempt-card-div">
            <Card body className="text-center attempt-card">
                <div className="attempt-card-content">
                    <div className="attempt-date-div">
                    <CardText className="attempt-card-text attempt-date">{props.attempt.attempt_date} -</CardText>
                    </div>
                    {props.attempt.is_flashed === true ? <CardText className="attempt-card-text">Flashed</CardText> : null}

                    {(props.attempt.number_of_falls !== 0 && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <CardText className="attempt-card-text">Falls: {props.attempt.number_of_falls}</CardText> : null}
                    {(props.attempt.is_clean === true && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <CardText className="attempt-card-text">Cleaned</CardText> : null}

                    {(props.climb.type === "Boulder" && props.attempt.is_clean === true && props.attempt.is_flashed !== true) ? <CardText className="attempt-card-text">Attempts: {props.attempt.number_of_attempts} - Cleaned</CardText> : null}
                    {(props.climb.type === "Boulder" && props.attempt.is_clean === false && props.attempt.is_flashed !== true) ? <CardText className="attempt-card-text">Attempts: {props.attempt.number_of_attempts}</CardText> : null}
                </div>

                <div className="attempt-card-buttons">
                    {!props.climb.is_archived ?
                        <>
                            <Button type="button" className="attempt-button edit-attempt-button" size="sm" onClick={() => { props.history.push(`/attempts/${props.attempt.id}/edit`) }}>Edit</Button>
                            {props.attempt.is_flashed === "" ?
                            <Button type="button" className="attempt-button delete-attempt-button" size="sm" onClick={() => {
                                    props.handleAttemptDelete(props.attempt.id)
                                }}>Delete</Button>
                                : null}
                        </>
                        : null}
                </div>
            </Card>
        </div>
    )
};

export default AttemptCard;