import React from 'react';

const AttemptCard = (props) => {
    return (
        <div className="attempts-list">
            <>
                <div className="each-attempt">
                    <h4>{props.attempt.attempt_date} -- </h4>
                    {props.attempt.is_flashed === true ? <h4>Flashed</h4> : null }
                    {props.attempt.number_of_falls !== 0 ? <h4>Falls: {props.attempt.number_of_falls}</h4> : null}
                    {props.attempt.is_clean === true ? <h4>Cleaned</h4> : null }
                </div>
                <div className="attempt-buttons">
                    {/* <button type="button" className="edit-attempt-button" onClick={() => { props.history.push(`/attempts/${props.attempt.id}/edit`) }}>Edit</button> */}
                    {!props.climb.is_archived ?
                        <button type="button" className="delete-attempt-button" onClick={() => {
                            props.handleAttemptDelete(props.attempt.id)
                        }}> Delete</button>
                        : null}
                </div>
            </>
        </div>
    )
};

export default AttemptCard;