import React, { useState, useEffect } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import AttemptApiManager from '../../modules/AttemptApiManager';
import './Climb.css';

const ClimbEditForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [attempts, setAttempts] = useState([]);

    const getAttempts = () => {
        return AttemptApiManager.getAttemptsByUserAndClimb(1, 1).then(attemptsFromApi => {
            setAttempts(attemptsFromApi);
        });
    };

    useEffect(() => {
        getAttempts();
    }, []);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const updateExistingClimb = (evt) => {
        evt.preventDefault();
        if (climb.type === "" || climb.grade === "" || climb.description === "" || climb.beta_comments === "" || climb.rating === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const editedClimb = {
                id: parseInt(props.match.params.climbId),
                userId: 1,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: climb.rating
            };

            ClimbApiManager.putClimb(editedClimb)
                .then(() => props.history.push("/climbs"));
        };
    };

    useEffect(() => {
        ClimbApiManager.getClimbById(props.match.params.climbId)
            .then(climb => {
                setClimb(climb);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <form className="edit-climb-form">
                <fieldset className="edit-climb-fieldset">
                    <h2>Edit Climb</h2>
                    <div className="edit-climb-container">
                        <label htmlFor="type">Type:</label>
                        <select id="type"
                            required
                            value={climb.type}
                            name="type"
                            onChange={handleFieldChange}
                        >
                            <option value="" disabled defaultValue>Select</option>
                            <option value="Top Rope">Top Rope</option>
                            <option value="Lead">Lead</option>
                            <option value="Boulder">Boulder</option>
                        </select>

                        <label htmlFor="grade">Grade:</label>
                        <input type="text"
                            id="grade"
                            required
                            value={climb.grade}
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="description">Description:</label>
                        <textarea type="text"
                            id="description"
                            required
                            rows="3"
                            value={climb.description}
                            onChange={handleFieldChange}
                            placeholder="ex. color, rope #, wall, starting holds, etc."
                        />

                        <label htmlFor="attempts">Attempts:</label>

                        <div className="attempts-list">
                            {attempts.map(attempt =>
                                <>
                                    <div className="each-attempt-form">
                                        <div className="attempt-content">
                                            <h4>{attempt.attempt_date} -- </h4>
                                            <h4>{attempt.is_flashed ? "Flashed" : null}</h4>
                                            <h4>{attempt.is_flashed || attempt.is_clean ? null : "Falls: " + attempt.number_of_falls}</h4>
                                            <h4>{attempt.is_clean ? "Cleaned" : null}</h4>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <label htmlFor="beta_comments">Beta/Comments:</label>
                        <textarea type="text"
                            id="beta_comments"
                            required
                            rows="3"
                            value={climb.beta_comments}
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="rating">Rating:</label>
                        <select id="rating"
                            required
                            value={climb.rating}
                            name="rating"
                            onChange={handleFieldChange}
                        >
                            <option value="" disabled defaultValue>Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="update-climb-button-container">
                        <button type="button"
                            disabled={isLoading}
                            onClick={updateExistingClimb}
                        >Save</button>
                        <button type="button" className="cancel-button"
                            onClick={() => { props.history.push("/climbs") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default ClimbEditForm;