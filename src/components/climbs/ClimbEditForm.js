import React, { useState, useEffect } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';

const ClimbEditForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", is_archived: false });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const updateExistingClimb = (evt) => {
        evt.preventDefault();
        if (climb.type === "" || climb.grade === "" || climb.rating === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true);

            const editedClimb = {
                id: parseInt(props.match.params.climbId),
                userId: activeUserId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: parseInt(climb.rating),
                is_archived: false
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

                        <label htmlFor="beta_comments">Beta/Comments:</label>
                        <textarea type="text"
                            id="beta_comments"
                            required
                            rows="3"
                            value={climb.beta_comments}
                            onChange={handleFieldChange}
                        />

                        <label htmlFor="rating">Enjoyment Rating:</label>
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