import React, { useState, useEffect } from 'react';
import './Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';

const ClimbCard = (props) => {
    const [attempts, setAttempts] = useState([]);

    const getAttempts = () => {
        return AttemptApiManager.getAttemptsByUserAndClimb(1, 1).then(attemptsFromApi => {
            setAttempts(attemptsFromApi);
        });
    };

    useEffect(() => {
        getAttempts();
    }, []);

    return (
        <div className="card climb-card">
            <div className="card-content climb-card-content">
                <h3>Type: {props.climb.type}</h3>
                <h3>Grade: {props.climb.grade}</h3>
                <h3>Description: {props.climb.description}</h3>
                <h3>Attempts:</h3>

                <div className="attempts-list">
                    {attempts.map(attempt =>
                        <>
                            <div className="each-attempt">
                                <h4>{attempt.attempt_number}.</h4>
                                <h4>{attempt.attempt_date} -- </h4>
                                <h4>{attempt.is_flashed ? "Flashed" : null}</h4>
                                <h4>{attempt.is_flashed || attempt.is_clean ? null : "Falls: " + attempt.number_of_falls}</h4>
                                <h4>{attempt.is_clean ? "Cleaned" : null}</h4>
                            </div>
                        </>
                    )}
                </div>

                <h3>Beta/Comments: {props.climb.beta_comments}</h3>
                <h3>Enjoyment Rating: {props.climb.rating}</h3>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button edit-button" onClick={() => { props.history.push(`/climbs/${props.climb.id}/edit`) }}>Edit</button>
                <button type="button" className="button archive-button">Archive</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleDelete(props.climb.id);
                }}>Delete</button>
            </div>
        </div>
    )
};

export default ClimbCard;