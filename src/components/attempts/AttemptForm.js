import React, { useState } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';

const AttemptForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, is_flashed: "", is_clean: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    const constructNewAttempt = (evt) => {
        evt.preventDefault();
        if (attempt.attempt_date === "" || attempt.is_clean === "") {
            window.alert("Please fill out all fields.")
        } else {
            setIsLoading(true);

            const newAttempt = {
                id: props.match.params.attemptId,
                climbId: parseInt(props.match.params.climbId),
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                is_flashed: attempt.is_flashed,
                is_clean: JSON.parse(attempt.is_clean)
            };

            AttemptApiManager.postAttempt(newAttempt)
                .then(() => props.history.push("/climbs"));
        }
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

                        {attempt.is_clean === "true" || attempt.is_clean === "" ? null :
                            <>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </>
                        }

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