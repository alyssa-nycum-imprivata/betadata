import React, { useState, useEffect } from 'react';
import AttemptApiManager from '../../modules/AttemptApiManager';
import ClimbApiManager from '../../modules/ClimbApiManager';

const AttemptEditForm = (props) => {
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", number_of_falls: 0, number_of_attempts: 0, is_flashed: "", is_clean: "", created_on: "" });
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", created_on: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    const updateExistingAttempt = (evt) => {
        evt.preventDefault();
        if (attempt.attempt_date === "") {
            window.alert("Please fill out all fields.");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")) {
            window.alert("If climb was not flashed, please enter at least 1 fall.");
        } else if ((attempt.is_clean === "false" || attempt.is_clean === false) && attempt.number_of_falls <= 0 && (climb.type === "Top Rope" || climb.type === "Lead")){
            window.alert("If climb was not cleaned, please enter at least 1 fall.");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt");
        } else if ((attempt.is_flashed === false || attempt.is_flashed === "false") && attempt.is_clean === "" && climb.type === "Boulder") {
            window.alert("Please select if climb was cleaned or not.");
        } else if (attempt.is_clean !== "" && attempt.number_of_attempts <= 0 && climb.type === "Boulder") {
            window.alert("Please enter at least 1 attempt.");
        } 
        else {

            setIsLoading(true);

            if (attempt.is_flashed !== "") {
                attempt.is_flashed = JSON.parse(attempt.is_flashed)
            }

            if (attempt.is_clean !== "") {
                attempt.is_clean = JSON.parse(attempt.is_clean)
            }

            if (climb.type === "Boulder" && (attempt.is_clean === "true" || attempt.is_clean === true)) {
                attempt.number_of_falls = (attempt.number_of_attempts - 1)
            }

            if (climb.type === "Boulder" && (attempt.is_clean === "false" || attempt.is_clean === false)) {
                attempt.number_of_falls = attempt.number_of_attempts
            }

            if (attempt.is_flashed === "true" || attempt.is_flashed === true) {
                attempt.number_of_falls = 0;
                attempt.number_of_attempts = 1;
                attempt.is_clean = "";
            }

            if (climb.type === "Top Rope" || climb.type === "Lead") {
                attempt.number_of_attempts = 1;
            }

            if ((attempt.is_clean === "true" || attempt.is_clean === true) && (climb.type === "Top Rope" || climb.type === "Lead")) {
                attempt.number_of_falls = 0
            }

            const editedAttempt = {
                id: props.match.params.attemptId,
                climbId: attempt.climbId,
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                number_of_attempts: parseInt(attempt.number_of_attempts),
                is_flashed: attempt.is_flashed,
                is_clean: attempt.is_clean,
                created_on: new Date()
            };

            AttemptApiManager.putAttempt(editedAttempt)
                .then(() => props.history.push("/climbs"));
        }
    };

    useEffect(() => {
        AttemptApiManager.getAttemptById(props.match.params.attemptId)
            .then(attempt => {
                setAttempt(attempt);
                ClimbApiManager.getClimbById(attempt.climbId)
                    .then(climb => {
                        setClimb(climb);
                        setIsLoading(false);
                    });
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

                        {attempt.is_flashed !== "" && (climb.type === "Top Rope" || climb.type === "Lead") ?
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
                                {attempt.is_flashed === false || attempt.is_flashed === "false" ?
                                <>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    required
                                    value={attempt.number_of_falls}
                                    onChange={handleFieldChange}
                                />
                                </>
                                : null}
                            </>
                            : null
                        }

                        {attempt.is_flashed !== "" && climb.type === "Boulder" ?
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
                                {attempt.is_flashed === "false" || attempt.is_flashed === false ?
                                <>
                                <label htmlFor="number_of_attempts">Number of Attempts:</label>
                                <input type="number"
                                    id="number_of_attempts"
                                    required
                                    value={attempt.number_of_attempts}
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
                                </>
                                : null }
                            </>
                            : null
                        }

                        {attempt.is_flashed === "" && (climb.type === "Top Rope" || climb.type === "Lead") ?
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
                                {attempt.is_clean === "false" || attempt.is_clean === false ?
                                <>
                                <label htmlFor="number_of_falls">Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    required
                                    value={attempt.number_of_falls}
                                    onChange={handleFieldChange}
                                />
                                </>
                                : null }
                            </>
                            : null
                        }

                        {attempt.is_flashed === "" && climb.type === "Boulder" ?
                            <>
                                <label htmlFor="number_of_attempts">Number of Attempts:</label>
                                <input type="number"
                                    id="number_of_attempts"
                                    required
                                    value={attempt.number_of_attempts}
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