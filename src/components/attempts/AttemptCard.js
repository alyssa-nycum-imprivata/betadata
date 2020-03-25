import React from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

const AttemptCard = (props) => {
    return (
        <div className="attempt-card-div">
            <Card body className="text-center attempt-card">
                <div className="attempt-card-content">
                    <CardText>{props.attempt.attempt_date} -- </CardText>
                    {props.attempt.is_flashed === true ? <CardText>Flashed</CardText> : null}

                    {(props.attempt.number_of_falls !== 0 && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <CardText>Falls: {props.attempt.number_of_falls}</CardText> : null}
                    {(props.attempt.is_clean === true && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <CardText>Cleaned</CardText> : null}

                    {(props.climb.type === "Boulder" && props.attempt.is_clean === true && props.attempt.is_flashed !== true) ? <CardText>Attempts: {props.attempt.number_of_attempts} - Cleaned</CardText> : null}
                    {(props.climb.type === "Boulder" && props.attempt.is_clean === false && props.attempt.is_flashed !== true) ? <CardText>Attempts: {props.attempt.number_of_attempts}</CardText> : null}
                </div>

                <div className="attempt-card-buttons">
                    {!props.climb.is_archived ?
                        <>
                            <Button type="button" className="climb-button edit-attempt-button" size="sm" onClick={() => { props.history.push(`/attempts/${props.attempt.id}/edit`) }}>Edit</Button>
                            {props.attempt.is_flashed === "" ?
                            <Button type="button" className="climb-button delete-attempt-button" size="sm" onClick={() => {
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