import React, { useState, useEffect } from 'react';
import '../climbs/Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';
import AttemptCard from '../attempts/AttemptCard';
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import './Archive.css';

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
        <div className="climb-card-div">
            <Card body className="text-center climb-card">
                <div className="climb-card-content">
                    <CardTitle><strong>Type:</strong> {props.climb.type}</CardTitle>
                    {props.climb.type === "Top Rope" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {props.climb.type === "Lead" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {props.climb.type === "Boulder" ? <CardTitle><strong>Grade:</strong> V{props.climb.grade}</CardTitle> : null}
                    {props.climb.description !== "" ? <CardTitle><strong>Description:</strong> {props.climb.description}</CardTitle> : null}
                    <CardTitle><strong>Attempts:</strong></CardTitle>

                    <div className="attempt-cards-container">
                        {attempts.map(attempt =>
                            < AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                {...props}
                            />
                        )}
                    </div>

                    {props.climb.beta_comments !== "" ? <CardTitle><strong>Beta/Comments:</strong> {props.climb.beta_comments}</CardTitle> : null}
                    <CardTitle><strong>Enjoyment Rating:</strong> {props.climb.rating} stars</CardTitle>
                </div>

                <div className="climb-card-buttons">
                    <Button type="button" className="climb-button undo-archive-climb-button" size="sm" onClick={() => props.handleUndoArchiveClimb(props.climb.id)}>Undo Archive</Button>
                    <Button type="button" className="climb-button delete-archived-climb-button" size="sm" onClick={() => {
                        props.handleClimbDelete(props.climb.id);
                    }}>Delete</Button>
                </div>
            </Card>
        </div>
    )
};

export default ArchiveCard;