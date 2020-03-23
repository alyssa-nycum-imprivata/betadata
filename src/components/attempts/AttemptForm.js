import React, { useState, useEffect } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';
import ClimbApiManager from '../../modules/ClimbApiManager';

const AttemptForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, number_of_attempts: 0, is_flashed: "", is_clean: "", created_on: "" });
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    useEffect(() => {
        ClimbApiManager.getClimbById(props.match.params.climbId)
            .then(climb => {
                setClimb(climb);
                setIsLoading(false);
            });
    }, []);

    const constructNewAttempt = (evt) => {
        evt.preventDefault();
        if (attempt.attempt_date === "" || attempt.is_clean === "") {
            window.alert("Please fill out all fields.")
        } else if (attempt.is_clean === "false" && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not cleaned, please enter at least 1 fall.")
        } else if (attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt.")
        } else {
            setIsLoading(true);

            if (climb.type === "Boulder" && attempt.is_clean === "true") {
                attempt.number_of_falls = (attempt.number_of_attempts - 1)
            }

            if (climb.type === "Boulder" && attempt.is_clean === "false") {
                attempt.number_of_falls = attempt.number_of_attempts
            }

            if (attempt.is_clean === "true" && (climb.type === "Top Rope" || climb.type === "Lead")) {
                attempt.number_of_falls = 0;
            }

            const newAttempt = {
                id: props.match.params.attemptId,
                climbId: parseInt(props.match.params.climbId),
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                number_of_attempts: parseInt(attempt.number_of_attempts),
                is_flashed: attempt.is_flashed,
                is_clean: JSON.parse(attempt.is_clean),
                created_on: new Date()
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

                        {(climb.type === "Boulder") ?
                            <>
                                <label htmlFor="number_of_attempts">Number of Attempts:</label>
                                <input type="number"
                                    id="number_of_attempts"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </>
                            : null
                        }

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

                        {(attempt.is_clean === "false" && (climb.type === "Top Rope" || climb.type === "Lead")) ?
                            <>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    required
                                    onChange={handleFieldChange}
                                />
                            </>
                            : null
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