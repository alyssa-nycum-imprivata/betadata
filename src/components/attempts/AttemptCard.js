import React from 'react';

const AttemptCard = (props) => {
    return (
        <div className="attempts-list">
                        <>
                            <div className="each-attempt">
                                <h4>{props.attempt.attempt_date} -- </h4>
                                <h4>{props.attempt.is_flashed ? "Flashed" : null}</h4>
                                <h4>{props.attempt.is_flashed || props.attempt.is_clean ? null : "Falls: " + props.attempt.number_of_falls}</h4>
                                <h4>{props.attempt.is_clean ? "Cleaned" : null}</h4>
                            </div>
                            <div className="attempt-buttons">
                                <button type="button" className="edit-attempt-button" onClick={() => { props.history.push(`/attempts/${props.attempt.id}/edit`) }}>Edit</button>
                                <button type="button" className="delete-attempt-button">Delete</button>
                            </div>
                        </>
                </div>
    )
};

export default AttemptCard;