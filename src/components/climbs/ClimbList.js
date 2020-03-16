import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';

const ClimbList = (props) => {
    const [climbs, setClimbs] = useState([]);

    const getClimbs = () => {
        return ClimbApiManager.getClimbs().then(climbsFromApi => {
            setClimbs(climbsFromApi)
        });
    };

    useEffect(() => {
        getClimbs();
    }, []);

    return (
        <>
            <div className="add-button-container">
                <button type="button" className="button add-button">Add Climb</button>
            </div>
            <div className="cards-container climb-cards-container">
                {climbs.map(climb =>
                    <ClimbCard
                        key={climb.id}
                        climb={climb}
                        {...props}
                    />
                )}
            </div>
        </>
    );
};

export default ClimbList;