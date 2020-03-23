import React, { useState, useEffect } from 'react';
import './Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';
import AttemptCard from '../attempts/AttemptCard';

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
        <div className="card climb-card">
            <div className="card-content climb-card-content">
                <h3>Type: {props.climb.type}</h3>
                {props.climb.type === "Top Rope" ? <h3>Grade: 5.{props.climb.grade}</h3> : null}
                {props.climb.type === "Lead" ? <h3>Grade: 5.{props.climb.grade}</h3> : null}
                {props.climb.type === "Boulder" ? <h3>Grade: V{props.climb.grade}</h3> : null}
                {props.climb.description !== "" ?<h3>Description: {props.climb.description}</h3> : null }
                <h3>Attempts:</h3>

                <button type="button" className="button add-attempt-button" onClick={() => { props.history.push(`/climbs/${props.climb.id}/add_attempt`) }}>Add Attempt</button>

                {attempts.map(attempt =>
                    < AttemptCard
                        key={attempt.id}
                        attempt={attempt}
                        isLoading={isLoading}
                        handleAttemptDelete={handleAttemptDelete}
                        {...props}
                    />
                )}

                {props.climb.beta_comments !== "" ? <h3>Beta/Comments: {props.climb.beta_comments}</h3> : null }
                <h3>Enjoyment Rating: {props.climb.rating}</h3>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button edit-button" onClick={() => { props.history.push(`/climbs/${props.climb.id}/edit`) }}>Edit</button>
                <button type="button" className="button archive-button" onClick={() => props.handleArchiveClimb(props.climb.id)}>Archive</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleClimbDelete(props.climb.id);
                }}>Delete</button>
            </div>
        </div>
    )
};

export default ClimbCard;