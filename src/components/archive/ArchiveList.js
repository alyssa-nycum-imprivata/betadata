import React, { useState, useEffect } from 'react';
import ArchiveCard from './ArchiveCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import '../climbs/Climb.css';
import './Archive.css';
import { Button, Card, CardTitle } from 'reactstrap';

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

    const sortRopeClimbsByGrade = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const archivedClimbs = climbsFromApi.filter(climb => climb.is_archived === true && (climb.type === "Top Rope" || climb.type === "Lead"))
            const changedGrades = archivedClimbs.map(climb => {
                if (climb.grade.includes("-")) {
                    climb.grade_altered = climb.grade.split("-")[0] + ".25"
                    return climb
                } else if (climb.grade.includes("+")) {
                    climb.grade_altered = climb.grade.split("+")[0] + ".75"
                    return climb
                } else {
                    climb.grade_altered = climb.grade + ".5"
                    return climb
                }
            })
            const sortedClimbs = changedGrades.sort((a, b) => {
                return a.grade_altered - b.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const sortBoulderClimbsByGrade = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const archivedClimbs = climbsFromApi.filter(climb => climb.is_archived === true && climb.type === "Boulder")
            const changedGrades = archivedClimbs.map(climb => {
                if (climb.grade.includes("-")) {
                    climb.grade_altered = climb.grade.split("-")[0] + ".25"
                    return climb
                } else if (climb.grade.includes("+")) {
                    climb.grade_altered = climb.grade.split("+")[0] + ".75"
                    return climb
                } else {
                    climb.grade_altered = climb.grade + ".5"
                    return climb
                }
            })
            const sortedClimbs = changedGrades.sort((a, b) => {
                return a.grade_altered - b.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const handleUndoArchiveClimb = (climbId) => {
        setIsLoading(true);
        ClimbApiManager.getClimbById(climbId).then(climb => {

            const activeClimb = {
                id: climbId,
                userId: activeUserId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: climb.rating,
                created_on: climb.created_on,
                is_archived: false
            };

            ClimbApiManager.putClimb(activeClimb);
            setIsLoading(false);
            props.history.push("/climbs");
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
                <div className="archive-button-container">
                    <Button type="button" className="sort-climbs-button" onClick={sortRopeClimbsByGrade}>Sort Rope Climbs By Grade</Button>
                    <Button type="button" className="sort-climbs-button" onClick={sortBoulderClimbsByGrade}>Sort Boulder Climbs By Grade</Button>
                    <Button type="button" className="sort-climbs-button" onClick={getClimbs}>View All Climbs</Button>
                </div>
                <div className="climb-cards-container">
                    {climbs.map(climb =>
                        <ArchiveCard
                            key={climb.id}
                            climb={climb}
                            isLoading={isLoading}
                            handleUndoArchiveClimb={handleUndoArchiveClimb}
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
                <div className="archive-button-container">
                    <Button type="button" className="sort-climbs-button" onClick={getClimbs}>View All Climbs</Button>
                </div>
                <div className="no-climbs-message-container">
                    <Card body className="text-center no-climbs-message-card">
                        <CardTitle className="no-climbs-message">You have no archived climbs.</CardTitle>
                    </Card>
                </div>
            </>
        )
    }
};

export default ArchiveList;