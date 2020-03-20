import React, { useState, useEffect } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';

const AttemptEditForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, is_flashed: "", is_clean: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
        console.log(stateToChange)
    };

    const updateExistingAttempt = (evt) => {
        if (attempt.is_flashed !== "") {
            evt.preventDefault();

            setIsLoading(true);

            const editedAttempt = {
                id: props.match.params.attemptId,
                climbId: attempt.climbId,
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                is_flashed: JSON.parse(attempt.is_flashed),
                is_clean: attempt.is_clean
            };
    
            AttemptApiManager.putAttempt(editedAttempt)
                .then(() => props.history.push("/climbs"));
        } else {
            evt.preventDefault();

            setIsLoading(true);

            const editedAttempt = {
                id: props.match.params.attemptId,
                climbId: attempt.climbId,
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                is_flashed: attempt.is_flashed,
                is_clean: JSON.parse(attempt.is_clean)
            };
    
            AttemptApiManager.putAttempt(editedAttempt)
                .then(() => props.history.push("/climbs"));
        }
        
    };

    useEffect(() => {
        AttemptApiManager.getAttemptById(props.match.params.attemptId)
            .then(attempt => {
                setAttempt(attempt);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <form className="edit-attempt-form">
                <fieldset className="edit-attempt-fieldset">
                    <h2>Edit Attempt</h2>
                    <div className="edit-attempt-container">
                        <label htmlFor="attempt_date">Attempt Date:</label>
                        <input type="date"
                            id="attempt_date"
                            required
                            value={attempt.attempt_date}
                            onChange={handleFieldChange}
                        />

                        {attempt.is_flashed === true || attempt.is_flashed === false || attempt.is_flashed === "true" || attempt.is_flashed === "false" ?
                            <>
                                <label htmlFor="is_flashed">Flashed?:</label>
                                <select id="is_flashed"
                                    required
                                    value={attempt.is_flashed}
                                    name="is_flashed"
                                    onChange={handleFieldChange}
                                >
                                    <option value="" disabled defaultValue>Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    value={attempt.number_of_falls}
                                    required
                                    onChange={handleFieldChange}
                                />
                            </>
                            : null
                        }

                        {attempt.is_clean === true || attempt.is_clean === false || attempt.is_clean === "true" || attempt.is_clean === "false" ?
                            <>
                                <label htmlFor="is_clean">Cleaned?:</label>
                                <select id="is_clean"
                                    required
                                    value={attempt.is_clean}
                                    name="is_clean"
                                    onChange={handleFieldChange}
                                >
                                    <option value="" disabled defaultValue>Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    value={attempt.number_of_falls}
                                    required
                                    onChange={handleFieldChange}
                                />
                            </>
                            : null
                        }


                    </div>
                    <div className="add-attempt-button-container">
                        <button type="button" disabled={isLoading} onClick={updateExistingAttempt}>Save</button>
                        <button type="button" className="cancel-button" onClick={() => { props.history.push("/climbs") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default AttemptEditForm;