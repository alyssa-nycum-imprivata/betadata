import React, { useState } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';

const AttemptForm = (props) => {
    const [attempt, setAttempt] = useState({ userId: "", climbId: "", attempt_date: "", is_flashed: false, number_of_falls: 0});
    const [checkbox, setCheckbox] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    const handleCheckbox = () => {
        setCheckbox(!checkbox)
    }

    const constructNewAttempt = (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        const newAttempt = {
            id: props.match.params.attemptId,
            userId: 1,
            climbId: 1,
            attempt_date: attempt.attempt_date,
            is_flashed: attempt.is_flashed,
            number_of_falls: parseInt(attempt.number_of_falls),
            is_clean: checkbox
        };

        AttemptApiManager.postAttempt(newAttempt)
            .then(() => props.history.push("/climbs"));
    };

    return (
        <>
            <form className="new-attempt-form">
                <fieldset className="new-attempt-fieldset">
                    <h2>Add a New Attempt</h2>
                    <div className="new-attempt-container">
                        <label htmlFor="attempt_date">Attempt Date:</label>
                        <input type="date"
                            id="attempt_date"
                            required
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="number_of_falls">Number of Falls:</label>
                        <input type="number"
                            id="number_of_falls"
                            required
                            onChange={handleFieldChange}
                        />

                        <div className="cleaned">
                            <label htmlFor="is_clean">Cleaned?:</label>
                            <input type="checkbox" id="is_clean" onChange={handleCheckbox}
                            />
                            <label htmlFor="is_clean">Yes</label>
                        </div>
                    </div>
                    <div className="add-attempt-button-container">
                        <button type="button" disabled={isLoading} onClick={constructNewAttempt}>Add</button>
                        <button type="button" className="cancel-button" onClick={() => { props.history.push("/climbs") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default AttemptForm;