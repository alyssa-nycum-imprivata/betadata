import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';

const ClimbList = (props) => {
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getClimbs = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
            setClimbs(activeClimbs);
        });
    };

    const sortClimbsByGrade = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
            const changedGrades = activeClimbs.map(climb => {
                if (climb.grade.includes("-")) {
                    climb.grade_altered = climb.grade.split("-")[0] + ".25"
                    return climb
                } else if (climb.grade.includes("+")) {
                    climb.grade_altered = climb.grade.split("+")[0] + ".5"
                    return climb
                } else {
                    climb.grade_altered = climb.grade
                    return climb
                }
            })
            const sortedClimbs = changedGrades.sort((a,b) => {
                return a.grade_altered - b.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const handleArchiveClimb = (climbId) => {
        setIsLoading(true);
        ClimbApiManager.getClimbById(climbId).then(climb => {

            const archivedClimb = {
                id: climbId,
                userId: activeUserId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: climb.rating,
                is_archived: true
            };

            ClimbApiManager.putClimb(archivedClimb);
            setIsLoading(false);
            props.history.push("/archive");
        });
    };

    const handleClimbDelete = (climbId) => {
        if (window.confirm("Are you sure you want to delete this climb?")) {
            setIsLoading(true);
            ClimbApiManager.deleteClimb(climbId)
                .then(() => ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                    const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
                    setClimbs(activeClimbs);
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
                    <button type="button" className="button sort-climbs-button" onClick={sortClimbsByGrade}>Sort Climbs By Grade</button>
                </div>
                <div className="cards-container climb-cards-container">
                    {climbs.map(climb =>
                        <ClimbCard
                            key={climb.id}
                            climb={climb}
                            isLoading={isLoading}
                            handleArchiveClimb={handleArchiveClimb}
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