import React, { useState, useEffect } from 'react';
import ArchiveCard from './ArchiveCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import '../climbs/Climb.css';

const ArchiveList = (props) => {
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = sessionStorage.getItem("userId");

    const getClimbs = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const archivedClimbs = climbsFromApi.filter(climb => climb.is_archived === true)
            setClimbs(archivedClimbs);
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
                <div className="cards-container climb-cards-container">
                    {climbs.map(climb =>
                        <ArchiveCard
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
                <div>
                    <h2>You have no archived climbs.</h2>
                </div>
            </>
        )
    }
};

export default ArchiveList;