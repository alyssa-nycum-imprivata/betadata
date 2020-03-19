import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';

const ClimbList = (props) => {
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = sessionStorage.getItem("userId");

    const getClimbs = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
            setClimbs(activeClimbs);
        });
    };

    const handleClimbDelete = (climbId) => {
        if (window.confirm("Are you sure you want to delete this climb?")) {
            setIsLoading(true);
            ClimbApiManager.deleteClimb(climbId)
                .then(() => ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                    setClimbs(climbsFromApi);
                    setIsLoading(false);
                }));
        };
    };

    useEffect(() => {
        getClimbs();
    }, []);

    if (climbs.length !== 0) {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button"
                        onClick={() => { props.history.push("/climbs/new") }}
                    >Add Climb</button>
                </div>
                <div className="cards-container climb-cards-container">
                    {climbs.map(climb =>
                        <ClimbCard
                            key={climb.id}
                            climb={climb}
                            isLoading={isLoading}
                            handleClimbDelete={handleClimbDelete}
                            {...props}
                        />
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button"
                        onClick={() => { props.history.push("/climbs/new") }}
                    >Add Climb</button>
                </div>
                <div>
                    <h2>You have no saved climbs.</h2>
                </div>
            </>
        )
    }
};

export default ClimbList;