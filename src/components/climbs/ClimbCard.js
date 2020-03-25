import React, { useState, useEffect } from 'react';
import './Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';
import AttemptCard from '../attempts/AttemptCard';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

const ClimbCard = (props) => {
    const [attempts, setAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getAttempts = () => {
        return AttemptApiManager.getAttemptsByClimb(props.climb.id).then(attemptsFromApi => {
            const sortedAttempts = attemptsFromApi.sort((a, b) => {
                return new Date(a.attempt_date) - new Date(b.attempt_date)
            })
            setAttempts(sortedAttempts);
        });
    };

    const handleAttemptDelete = (attemptId) => {
        if (window.confirm("Are you sure you want to delete this attempt?")) {
            setIsLoading(true);
            AttemptApiManager.deleteAttempt(attemptId)
                .then(() => AttemptApiManager.getAttemptsByClimb(props.climb.id).then(attemptsFromApi => {
                    const sortedAttempts = attemptsFromApi.sort((a, b) => {
                        return new Date(a.attempt_date) - new Date(b.attempt_date)
                    })
                    setAttempts(sortedAttempts);
                }));
        };
    };

    useEffect(() => {
        getAttempts();
    }, []);

    return (
        <div className="climb-card-div">
            <Card body className="text-center climb-card">
                <div className="climb-card-content">
                    <CardTitle><strong>Type:</strong> {props.climb.type}</CardTitle>
                    {props.climb.type === "Top Rope" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {props.climb.type === "Lead" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {props.climb.type === "Boulder" ? <CardTitle><strong>Grade:</strong> V{props.climb.grade}</CardTitle> : null}
                    {props.climb.description !== "" ? <CardTitle><strong>Description:</strong> {props.climb.description}</CardTitle> : null}
                    <CardTitle><strong>Attempts:</strong></CardTitle>

                    <Button type="button" className="climb-button add-attempt-button" size="sm" onClick={() => { props.history.push(`/climbs/${props.climb.id}/add_attempt`) }}>Add Attempt</Button>

                    <div className="attempt-cards-container">
                        {attempts.map(attempt =>
                            < AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                isLoading={isLoading}
                                handleAttemptDelete={handleAttemptDelete}
                                {...props}
                            />
                        )}
                    </div>

                    {props.climb.beta_comments !== "" ? <CardTitle><strong>Beta/Comments:</strong> {props.climb.beta_comments}</CardTitle> : null}
                    <CardTitle><strong>Enjoyment Rating:</strong> {props.climb.rating === 1 ? props.climb.rating + " star" : props.climb.rating + " stars"}</CardTitle>
                </div>
                <div className="climb-card-buttons">
                    <Button type="button" className="climb-button edit-climb-button" size="sm" onClick={() => { props.history.push(`/climbs/${props.climb.id}/edit`) }}>Edit</Button>
                    <Button type="button" className="climb-button archive-climb-button" size="sm" onClick={() => props.handleArchiveClimb(props.climb.id)}>Archive</Button>
                    <Button type="button" className="climb-button delete-climb-button" size="sm" onClick={() => {
                        props.handleClimbDelete(props.climb.id);
                    }}>Delete</Button>
                </div>
            </Card>
        </div>
    )
};

export default ClimbCard;