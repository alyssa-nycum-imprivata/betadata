import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';
import { Button, Card, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap';
import ArchiveCard from '../archive/ArchiveCard';
import GymApiManager from '../../modules/GymApiManager';
import { Bar } from 'react-chartjs-2';

const ClimbList = (props) => {
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [gyms, setGyms] = useState([]);
    const [boulderChartData, setBoulderChartData] = useState({});
    const [isSortingBoulder, setIsSortingBoulder] = useState(false);
    const [ropeChartData, setRopeChartData] = useState({});
    const [isSortingRope, setIsSortingRope] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const checkForGyms = () => {
        getGyms();
        if (gyms.length === 0) {
            window.alert("Please add a gym before creating your first climb.")
        } else {
            props.history.push("/climbs/new");
        };
    };

    const getGyms = () => {
        GymApiManager.getGymsByUser(activeUserId).then(gyms => {
            setGyms(gyms);
        });
    };

    const sortClimbsByCreatedOnDate = (climbsFromApi) => {
        const sortedClimbs = climbsFromApi.sort((a, b) => {
            return new Date(b.created_on) - new Date(a.created_on)
        })
        setClimbs(sortedClimbs)
        setIsSorting(false);
        setIsSortingRope(false);
        setIsSortingBoulder(false);
    }

    const getActiveClimbs = () => {
        setIsFiltering(false);
        return ClimbApiManager.getActiveClimbsByUser(activeUserId).then(climbsFromApi => {
            sortClimbsByCreatedOnDate(climbsFromApi)
        });
    };

    const getFilteredProperties = (evt) => {
        const stateToChange = { ...filteredProperties };
        stateToChange[evt.target.id] = evt.target.value;
        setFilteredProperties(stateToChange)
        const valuesArray = Object.values(stateToChange)
        const filteredValuesArray = valuesArray.filter(value => value !== "" && value !== "all")
        ClimbApiManager.getClimbsByFilter(activeUserId, filteredValuesArray).then(climbsFromApi => {
            sortClimbsByCreatedOnDate(climbsFromApi)
        })
    }

    const sortRopeClimbsByGrade = () => {
        setIsFiltering(false);
        setIsSorting(true);
        setIsSortingRope(true);
        setIsSortingBoulder(false);
        getRopeSortingChart();
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false && (climb.type === "Top Rope" || climb.type === "Lead"))
            const changedGrades = activeClimbs.map(climb => {
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
                return b.grade_altered - a.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const getRopeSortingChart = () => {
        return ClimbApiManager.getActiveClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeRopeClimbs = climbsFromApi.filter(climb => (climb.type === "Top Rope" || climb.type === "Lead"))
            const activeRopeGrades = activeRopeClimbs.map(climb => climb.grade)
            const counts = { "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10-": 0, "10+": 0, "11-": 0, "11+": 0, "12-": 0, "12+": 0, "13-": 0 };
            activeRopeGrades.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            const finalCounts = Object.values(counts);
            setRopeChartData({
                labels: ["5.5", "5.6", "5.7", "5.8", "5.9", "5.10-", "5.10+", "5.11-", "5.11+", "5.12-", "5.12+", "5.13-" ],
                datasets: [
                    {
                        data: finalCounts,
                        backgroundColor: "#C19070",
                        borderWidth: 4
                    }
                ]
            })
        })
    };

    const sortBoulderClimbsByGrade = () => {
        setIsFiltering(false);
        setIsSorting(true);
        setIsSortingBoulder(true);
        setIsSortingRope(false);
        getBoulderSortingChart();
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false && climb.type === "Boulder")
            const sortedClimbs = activeClimbs.sort((a, b) => {
                return b.grade - a.grade
            })
            setClimbs(sortedClimbs);
        });
    };

    const getBoulderSortingChart = () => {
        return ClimbApiManager.getActiveClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeBoulderClimbs = climbsFromApi.filter(climb => climb.type === "Boulder")
            const activeBoulderGrades = activeBoulderClimbs.map(climb => climb.grade)
            const counts = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
            activeBoulderGrades.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            const finalCounts = Object.values(counts);
            setBoulderChartData({
                labels: ["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"],
                datasets: [
                    {
                        data: finalCounts,
                        backgroundColor: "#C19070",
                        borderWidth: 4
                    }
                ]
            })
        })
    };

    const handleArchiveClimb = (climbId) => {
        if (window.confirm("Are you sure you want to archive this climb?")) {
            setIsLoading(true);
            ClimbApiManager.getClimbById(climbId).then(climb => {

                const archivedClimb = {
                    id: climbId,
                    userId: activeUserId,
                    gymId: climb.gymId,
                    type: climb.type,
                    grade: climb.grade,
                    description: climb.description,
                    beta_comments: climb.beta_comments,
                    rating: climb.rating,
                    created_on: climb.created_on,
                    is_archived: true
                };

                ClimbApiManager.putClimb(archivedClimb);
                setIsLoading(false);
                getActiveClimbs();
            });
        }
    };

    const handleClimbDelete = (climbId) => {
        if (!window.confirm("Are you sure you want to delete this climb?")) {
            return;
        }
        setIsLoading(true);
        ClimbApiManager.deleteClimb(climbId)
            .then(() => ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
                const sortedClimbs = activeClimbs.sort((a, b) => {
                    return new Date(b.created_on) - new Date(a.created_on)
                })
                setClimbs(sortedClimbs);
                setIsLoading(false);
                setIsFiltering(false);
            }));
    };

    const handleUndoArchiveClimb = (climbId) => {
        setIsLoading(true);
        ClimbApiManager.getClimbById(climbId).then(climb => {

            const activeClimb = {
                id: climbId,
                userId: activeUserId,
                gymId: climb.gymId,
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
            getActiveClimbs();
        });
    };

    useEffect(() => {
        getActiveClimbs();
        getGyms();
    }, []);

    if (climbs.length !== 0) {
        return (
            <>
                <div className="add-climb-button-container">
                    <div className="climb-buttons-div">
                        <Button type="button" className="add-climb-button"
                            onClick={checkForGyms}>Add Climb</Button>
                        <Button type="button" className="sort-climbs-button" onClick={() => { setIsFiltering(true); setIsSortingRope(false); setIsSortingBoulder(false); }}>Filter Climbs</Button>
                        <Button type="button" className="sort-climbs-button" id="rope-sorting-button" onClick={sortRopeClimbsByGrade}>Sort Rope Climbs By Grade</Button>
                        <Button type="button" className="sort-climbs-button" id="boulder-sorting-button" onClick={sortBoulderClimbsByGrade}>Sort Boulder Climbs By Grade</Button>
                        {isFiltering === true || isSorting === true ? <Button type="button" className="sort-climbs-button" onClick={getActiveClimbs}>View All Active Climbs</Button> : null}
                    </div>
                    <div className="gym-buttons-div">
                        <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
                        <Button type="button" className="view-gyms-button" onClick={() => { props.history.push("/gyms") }}>View Gyms</Button>
                    </div>
                </div>

                <div className="filter-form-div">
                    {isFiltering === false ? null :
                        <Form className="filter-climbs-form">
                            <FormGroup className="filter-climbs-form-header-container">
                                <h6 className="filter-climbs-form-header">Filter Climbs</h6>
                            </FormGroup>
                            <FormGroup className="filter-climbs-form-input-container">
                                <div className="filter-input-div">
                                    <Label htmlFor="statusFilter" className="climb-label">By Status</Label>
                                    <Input bsSize="sm" id="statusFilter"
                                        type="select"
                                        className="filter-climb-input"
                                        name="statusFilter"
                                        onChange={getFilteredProperties}
                                    >
                                        <option value="" defaultValue>Select</option>
                                        <option value="is_archived=false">Active</option>
                                        <option value="is_archived=true">Archived</option>
                                        <option value="all">Both</option>
                                    </Input>
                                </div>

                                <div className="filter-input-div">
                                    <Label htmlFor="gymFilter" className="climb-label">By Gym</Label>
                                    <Input bsSize="sm" id="gymFilter"
                                        type="select"
                                        className="filter-climb-input"
                                        name="gymFilter"
                                        onChange={getFilteredProperties}
                                    >
                                        <option value="" defaultValue>Select</option>
                                        {gyms.map(gym =>
                                            <option key={gym.id} value={`gymId=${gym.id}`}>{gym.name}</option>
                                        )}
                                        <option value="all">All</option>
                                    </Input>
                                </div>

                                <div className="filter-input-div">
                                    <Label htmlFor="typeFilter" className="climb-label">By Type</Label>
                                    <Input bsSize="sm" id="typeFilter"
                                        type="select"
                                        className="filter-climb-input"
                                        name="typeFilter"
                                        onChange={getFilteredProperties}
                                    >
                                        <option value="" defaultValue>Select</option>
                                        <option value="type=Top Rope">Top Rope</option>
                                        <option value="type=Lead">Lead</option>
                                        <option value="type=Top Rope&type=Lead">Top Rope and Lead</option>
                                        <option value="type=Boulder">Boulder</option>
                                        <option value="all">All</option>
                                    </Input>
                                </div>

                                {filteredProperties.typeFilter === "type=Boulder" ?
                                    <>
                                        <div className="filter-input-div">
                                            <Label htmlFor="gradeFilter" className="climb-label">By Grade</Label>
                                            <Input bsSize="sm" id="gradeFilter"
                                                type="select"
                                                className="filter-climb-input"
                                                name="gradeFilter"
                                                onChange={getFilteredProperties}
                                            >
                                                <option value="" defaultValue>Select</option>
                                                <option value="grade=0">V0</option>
                                                <option value="grade=1">V1</option>
                                                <option value="grade=2">V2</option>
                                                <option value="grade=3">V3</option>
                                                <option value="grade=4">V4</option>
                                                <option value="grade=5">V5</option>
                                                <option value="grade=6">V6</option>
                                                <option value="grade=7">V7</option>
                                                <option value="grade=8">V8</option>
                                                <option value="grade=9">V9</option>
                                                <option value="grade=10">V10</option>
                                                <option value="all">All</option>
                                            </Input>
                                        </div>
                                    </>
                                    : null
                                }

                                {filteredProperties.typeFilter === "type=Top Rope" || filteredProperties.typeFilter === "type=Lead" || filteredProperties.typeFilter === "type=Top Rope&type=Lead" ?
                                    <>
                                        <div className="filter-input-div">
                                            <Label htmlFor="gradeFilter" className="climb-label">By Grade</Label>
                                            <Input bsSize="sm" id="gradeFilter"
                                                type="select"
                                                className="filter-climb-input"
                                                name="gradeFilter"
                                                onChange={getFilteredProperties}
                                            >
                                                <option value="" defaultValue>Select</option>
                                                <option value="grade=5">5.5</option>
                                                <option value="grade=6">5.6</option>
                                                <option value="grade=7">5.7</option>
                                                <option value="grade=8">5.8</option>
                                                <option value="grade=9">5.9</option>
                                                <option value="grade=10-">5.10-</option>
                                                <option value="grade=10+">5.10+</option>
                                                <option value="grade=11-">5.11-</option>
                                                <option value="grade=11+">5.11+</option>
                                                <option value="grade=12-">5.12-</option>
                                                <option value="grade=12+">5.12+</option>
                                                <option value="grade=13">5.13-</option>
                                                <option value="all">All</option>
                                            </Input>
                                        </div>
                                    </>
                                    :
                                    null
                                }

                                <div className="filter-input-div">
                                    <Label htmlFor="ratingFilter" className="climb-label">By Enjoyment Rating</Label>
                                    <Input bsSize="sm" id="ratingFilter"
                                        type="select"
                                        className="filter-climb-input"
                                        name="ratingFilter"
                                        onChange={getFilteredProperties}
                                    >
                                        <option value="" defaultValue>Select</option>
                                        <option value="rating=1">1 star</option>
                                        <option value="rating=2">2 stars</option>
                                        <option value="rating=3">3 stars</option>
                                        <option value="rating=4">4 stars</option>
                                        <option value="rating=5">5 stars</option>
                                        <option value="all">All</option>
                                    </Input>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Button type="button" size="sm" className="filter-climbs-cancel-button" onClick={() => { setIsFiltering(false) }}>Close</Button>
                            </FormGroup>
                        </Form>
                    }
                </div>

                {isSortingBoulder === true ?
                    <div className="chart-div">
                        <Bar className="chart" data={boulderChartData} options={{
                            responsive: true,
                            title: { text: "Number of Climbs by Grade", display: true },
                            legend: { display: false },
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        }
                                    }
                                ]
                            }
                        }} />
                    </div>
                    : null}

                {isSortingRope === true ?
                    <div className="chart-div">
                        <Bar className="chart" data={ropeChartData} options={{
                            responsive: true,
                            title: { text: "Number of Climbs by Grade", display: true },
                            legend: { display: false },
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        }
                                    }
                                ]
                            }
                        }} />
                    </div>
                    : null}

                <div className="climb-cards-container">
                    {climbs.map(climb => {
                        if (climb.is_archived === false) {
                            return <ClimbCard
                                key={climb.id}
                                climb={climb}
                                isLoading={isLoading}
                                handleArchiveClimb={handleArchiveClimb}
                                handleClimbDelete={handleClimbDelete}
                                {...props}
                            />
                        } else {
                            return <ArchiveCard
                                key={climb.id}
                                climb={climb}
                                isLoading={isLoading}
                                handleUndoArchiveClimb={handleUndoArchiveClimb}
                                handleClimbDelete={handleClimbDelete}
                                {...props}
                            />
                        }
                    }
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="add-climb-button-container">
                    <div className="climb-buttons-div">
                        <Button type="button" className="add-climb-button"
                            onClick={checkForGyms}>Add Climb</Button>
                        <Button type="button" className="sort-climbs-button" onClick={getActiveClimbs}>View All Climbs</Button>
                    </div>
                    <div className="gym-buttons-div">
                        <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
                        <Button type="button" className="view-gyms-button" onClick={() => { props.history.push("/gyms") }}>View Gyms</Button>
                    </div>
                </div>
                <div className="no-climbs-message-container">
                    <Card body className="text-center no-climbs-message-card">
                        <CardTitle className="no-climbs-message">You have no saved climbs.</CardTitle>
                    </Card>
                </div>
            </>
        )
    }
};

export default ClimbList;