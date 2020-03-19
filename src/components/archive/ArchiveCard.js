import React, { useState, useEffect } from 'react';
import '../climbs/Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';
import AttemptCard from '../attempts/AttemptCard';

const ArchiveCard = (props) => {
    const [attempts, setAttempts] = useState([]);

    const getAttempts = () => {
        return AttemptApiManager.getAttemptsByClimb(props.climb.id).then(attemptsFromApi => {
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

                {attempts.map(attempt => 
                        < AttemptCard
                            key={attempt.id}
                            attempt={attempt}
                            {...props}
                        />
                )}

                <h3>Beta/Comments: {props.climb.beta_comments}</h3>
                <h3>Enjoyment Rating: {props.climb.rating}</h3>
            </div>
            <div className="card-buttons-container">
                <button type="button" className="button archive-button">Undo Archive</button>
                <button type="button" className="button delete-button" onClick={() => {
                    props.handleClimbDelete(props.climb.id);
                }}>Delete</button>
            </div>
        </div>
    )
};

export default ArchiveCard;