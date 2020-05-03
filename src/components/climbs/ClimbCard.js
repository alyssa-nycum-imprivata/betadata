import React, { useState, useEffect } from 'react';
import './Climb.css';
import AttemptApiManager from '../../modules/AttemptApiManager';
import AttemptCard from '../attempts/AttemptCard';
import { Card, Button, CardTitle } from 'reactstrap';
import GymApiManager from '../../modules/GymApiManager';

const ClimbCard = (props) => {
    // preparing to set attempts and gym in state
    const [attempts, setAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [gym, setGym] = useState([]);

    // get all attempts for a climb based on the climb id, sort them from the least recent to the most recent, and set the attempts in state
    const getAttempts = () => {
        return AttemptApiManager.getAttemptsByClimb(props.climb.id).then(attemptsFromApi => {
            const sortedAttempts = attemptsFromApi.sort((a, b) => {
                return new Date(a.attempt_date) - new Date(b.attempt_date)
            })
            setAttempts(sortedAttempts);
        });
    };

    // deletes a specific attempt from the database, re-sorts the remaining attempts from least recent to the most recent, updates the attempts in state, and triggers a page re-load
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

    // gets gets the gym associated to a climb by a specific gym id after the initial page render and sets it in state
    const getGym = () => {
        GymApiManager.getGymById(props.climb.gymId).then(gym => {
            setGym(gym);
        });
    };

    // gets the attempts and gym after the initial page render
    useEffect(() => {
        getAttempts();
        getGym();
    }, []);

    // returns a card for each climb created by the user
    // also returns an attempt card for each attempt of the climb within the climb card
    // each card also includes the gym, type, grade, bete/comments, & enjoyment rating and 'add attempt', 'edit', 'archive', and 'delete' buttons
    return (
        <div className="climb-card-div">

            <Card body className="text-center climb-card">

                <div className="climb-card-content">
                    {/* returns the gym */}
                    <CardTitle><strong>Gym:</strong> {gym.name}</CardTitle>
                    {/* returns the type of climb */}
                    <CardTitle><strong>Type:</strong> {props.climb.type}</CardTitle>
                    {/* if the climb type is 'top rope', returns the climb prefaced by a '5.' */}
                    {props.climb.type === "Top Rope" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {/* if the climb type is 'lead', returns the climb prefaced by a '5.' */}
                    {props.climb.type === "Lead" ? <CardTitle><strong>Grade:</strong> 5.{props.climb.grade}</CardTitle> : null}
                    {/* if the climb type is 'boulder', returns the climb prefaced by a 'V' */}
                    {props.climb.type === "Boulder" ? <CardTitle><strong>Grade:</strong> V{props.climb.grade}</CardTitle> : null}
                    {/* if the climb description is not null (optional field), returns the climb description */}
                    {props.climb.description !== "" ? <CardTitle><strong>Description:</strong> {props.climb.description}</CardTitle> : null}
                    {/* returns the 'attempts' label */}
                    <CardTitle><strong>Attempts:</strong></CardTitle>

                    {/* when the 'add attempt' button is clicked, re-direct to the 'add a new attempt' form */}
                    <Button type="button" className="climb-button add-attempt-button" size="sm" onClick={() => { props.history.push(`/climbs/${props.climb.id}/add_attempt`) }}>Add Attempt</Button>

                    {/* for each attempt set in the attempts state, return an attempt card */}
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

                    {/* if the beta/comments is not null (optional field), returns the beta/comments */}
                    {props.climb.beta_comments !== "" ? <CardTitle><strong>Beta/Comments:</strong> {props.climb.beta_comments}</CardTitle> : null}
                    {/* returns the enjoyment rating */}
                    <CardTitle><strong>Enjoyment Rating:</strong> {props.climb.rating === 1 ? props.climb.rating + " star" : props.climb.rating + " stars"}</CardTitle>
                </div>
                
                <div className="climb-card-buttons">
                    {/* when the 'edit' button is clicked, re-direct to the 'edit climb' form */}
                    <Button type="button" className="climb-button edit-climb-button" size="sm" onClick={() => { props.history.push(`/climbs/${props.climb.id}/edit`) }}>Edit</Button>
                    {/* when the 'archive' button is clicked, execute the handleArchiveClimb function in ClimbList.js */}
                    <Button type="button" className="climb-button archive-climb-button" size="sm" onClick={() => props.handleArchiveClimb(props.climb.id)}>Archive</Button>
                    {/* when the 'delete' button is clicked, execute the handleClimbDelete function in ClimbList.js */}
                    <Button type="button" className="climb-button delete-climb-button" size="sm" onClick={() => {
                        props.handleClimbDelete(props.climb.id);
                    }}>Delete</Button>
                </div>

            </Card>

        </div>
    )
};

export default ClimbCard;