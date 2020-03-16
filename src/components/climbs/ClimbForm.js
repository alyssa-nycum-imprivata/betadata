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
                            <option value="pop rope">Top Rope</option>
                            <option value="lead">Lead</option>
                            <option value="boulder">Boulder</option>
                        </select>

                        <label htmlFor="grade">Grade:</label>
                        <input type="text"
                            id="grade"
                            required
                            onChange={handleFieldChange}
                            placeholder="Grade"
                        />

                        <label htmlFor="description">Description:</label>
                        <input type="text"
                            id="description"
                            required
                            onChange={handleFieldChange}
                            placeholder="Description"
                        />

                        <label htmlFor="beta_comments">Beta/Comments:</label>
                        <input type="text"
                            id="beta_comments"
                            required
                            onChange={handleFieldChange}
                            placeholder="Beta/Comments"
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
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default ClimbForm;