import React, { useState } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';

const ClimbForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const constructNewClimb = (evt) => {
        evt.preventDefault();
        if (climb.type === "" || climb.grade === "" || climb.description === "" || climb.beta_comments === "" || climb.rating === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const newClimb = {
                id: props.match.params.climbId,
                userId: 1,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: climb.rating
            };

            ClimbApiManager.postClimb(newClimb)
                .then(() => props.history.push("/climbs"));
        };
    };

    return (
        <>
            <form className="new-climb-form">
                <fieldset className="new-climb-fieldset">
                    <h2>Add a New Climb</h2>
                    <div className="new-climb-container">
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
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="description">Description:</label>
                        <textarea type="text"
                            id="description"
                            rows="3"
                            required
                            onChange={handleFieldChange}
                            placeholder="ex. color, rope #, wall, starting holds, etc."
                        />

                        <button type="button" className="button add-attempt-button">Add Attempt</button>

                        <label htmlFor="beta_comments">Beta/Comments:</label>
                        <textarea type="text"
                            id="beta_comments"
                            rows="3"
                            required
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
                    <div className="add-climb-button-container">
                        <button type="button"
                            disabled={isLoading}
                            onClick={constructNewClimb}
                        >Add</button>
                        <button type="button"
                            className="cancel-button"
                            onClick={() => { props.history.push("/climbs") }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default ClimbForm;