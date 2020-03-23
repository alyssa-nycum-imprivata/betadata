import React from 'react';

const AttemptCard = (props) => {
    return (
        <div className="attempts-list">
            <>
                <div className="each-attempt">
                    <h4>{props.attempt.attempt_date} -- </h4>
                    {props.attempt.is_flashed === true ? <h4>Flashed</h4> : null}

                    {(props.attempt.number_of_falls !== 0 && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <h4>Falls: {props.attempt.number_of_falls}</h4> : null}
                    {(props.attempt.is_clean === true && (props.climb.type === "Top Rope" || props.climb.type === "Lead")) ? <h4>Cleaned</h4> : null}

                    {(props.climb.type === "Boulder" && props.attempt.is_clean === true && props.attempt.is_flashed !== true) ? <h4>Attempts: {props.attempt.number_of_attempts} - Cleaned</h4> : null}
                    {(props.climb.type === "Boulder" && props.attempt.is_clean === false && props.attempt.is_flashed !== true) ? <h4>Attempts: {props.attempt.number_of_attempts}</h4> : null}

                </div>
                <div className="attempt-buttons">
                    {!props.climb.is_archived ?
                        <>
                            <button type="button" className="edit-attempt-button" onClick={() => { props.history.push(`/attempts/${props.attempt.id}/edit`) }}>Edit</button>
                            {props.attempt.is_flashed === "" ?
                            <button type="button" className="delete-attempt-button" onClick={() => {
                                props.handleAttemptDelete(props.attempt.id)
                            }}> Delete</button>
                            : null} 
                        </>
                        : null}
                </div>
            </>
        </div>
    )
};

export default AttemptCard;