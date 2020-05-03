import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';
import { Button, Card, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap';
import ArchiveCard from '../archive/ArchiveCard';
import GymApiManager from '../../modules/GymApiManager';
import { Bar } from 'react-chartjs-2';

const ClimbList = (props) => {

    // preparing to set climbs, gyms, filtering data, sorting data, and chart data in state by the logged in user
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [gyms, setGyms] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [boulderChartData, setBoulderChartData] = useState({});
    const [isSortingBoulder, setIsSortingBoulder] = useState(false);
    const [ropeChartData, setRopeChartData] = useState({});
    const [isSortingRope, setIsSortingRope] = useState(false);
    const [statusSort, setStatusSort] = useState({ includeArchivedRope: "no", includeArchivedBoulder: "no" });

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // if the 'add climb' button is clicked, check to make sure at least 1 gym has been created and set in state
    // if not, alert the user to create a gym first
    // if there is at least 1 gym, re-direct to the 'add a new climb' form
    const checkForGyms = () => {
        if (gyms.length === 0) {
            window.alert("Please add a gym before creating your first climb.")
        } else {
            props.history.push("/climbs/new");
        };
    };

    // gets the gyms created by the logged in user to be checked in the checkForGyms function and sets them in state
    const getGyms = () => {
        GymApiManager.getGymsByUser(activeUserId).then(gyms => {
            setGyms(gyms);
        });
    };

    // sorts the active climbs in order by created on date with the most recent climb created displayed first and sets them in state
    const sortClimbsByCreatedOnDate = (climbsFromApi) => {
        const sortedClimbs = climbsFromApi.sort((a, b) => {
            return new Date(b.created_on) - new Date(a.created_on)
        })
        setClimbs(sortedClimbs)
        setIsSorting(false);
        setIsSortingRope(false);
        setIsSortingBoulder(false);
    }

    // gets only active climbs created by the user and passes them to the sortClimbsByCreatedOnDate function
    const getActiveClimbs = () => {
        setStatusSort({
            includeArchivedRope: "no",
            includeArchivedBoulder: "no"
        })
        setIsFiltering(false);
        return ClimbApiManager.getActiveClimbsByUser(activeUserId).then(climbsFromApi => {
            sortClimbsByCreatedOnDate(climbsFromApi)
        });
    };

    // listens to what the user selects from different climb filter inputs, puts those different climb properties in an array, and displays climbs that match those properties in real time as the user is filtering
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

    // handles sorting only top rope and lead climbs
    const sortRopeClimbsByGrade = (evt) => {
        setIsFiltering(false);
        setIsSorting(true);
        setIsSortingRope(true);
        setIsSortingBoulder(false);
        const stateToChange = { ...statusSort };
        stateToChange[evt.target.id] = evt.target.value;
        setStatusSort(stateToChange)
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            let specifiedClimbs = [];
            if (stateToChange.includeArchivedRope === "no") {
                // if the user chooses not to include archived climbs, only display active climbs
                specifiedClimbs = climbsFromApi.filter(climb => climb.is_archived === false && (climb.type === "Top Rope" || climb.type === "Lead"))
            } else {
                // if the user chooses to include archived climbs, display archived and active climbs
                specifiedClimbs = climbsFromApi.filter(climb => (climb.type === "Top Rope" || climb.type === "Lead"))
            }
            // this function changes the grades to integers 
            const changedGrades = specifiedClimbs.map(climb => {
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
            // this function takes the integer grades and sorts them from the highest number to the lowest number and sets them in state
            const sortedClimbs = changedGrades.sort((a, b) => {
                return b.grade_altered - a.grade_altered
            })
            setClimbs(sortedClimbs);
            // the following functions count how many of each climb grade there are and displays them in a bar chart
            const specifiedRopeGrades = sortedClimbs.map(climb => climb.grade)
            const counts = { "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10-": 0, "10+": 0, "11-": 0, "11+": 0, "12-": 0, "12+": 0, "13-": 0 };
            specifiedRopeGrades.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            const finalCounts = Object.values(counts);
            setRopeChartData({
                labels: ["5.5", "5.6", "5.7", "5.8", "5.9", "5.10-", "5.10+", "5.11-", "5.11+", "5.12-", "5.12+", "5.13-"],
                datasets: [
                    {
                        data: finalCounts,
                        backgroundColor: "#C19070",
                        borderWidth: 4
                    }
                ]
            })
        });
    };

    // handles sorting only boulder climbs
    const sortBoulderClimbsByGrade = (evt) => {
        setIsFiltering(false);
        setIsSorting(true);
        setIsSortingBoulder(true);
        setIsSortingRope(false);
        const stateToChange = { ...statusSort };
        stateToChange[evt.target.id] = evt.target.value;
        setStatusSort(stateToChange)
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            let specifiedClimbs = [];
            if (stateToChange.includeArchivedBoulder === "no") {
                // if the user chooses not to include archived climbs, only display active climbs
                specifiedClimbs = climbsFromApi.filter(climb => climb.is_archived === false && climb.type === "Boulder")
            } else {
                // if the user chooses to include archived climbs, display archived and active climbs
                specifiedClimbs = climbsFromApi.filter(climb => climb.type === "Boulder")
            }
            // this function sorts the grades from the highest number to the lowest number and sets them in state
            const sortedClimbs = specifiedClimbs.sort((a, b) => {
                return b.grade - a.grade
            })
            setClimbs(sortedClimbs);
            // the following functions count how many of each climb grade there are and displays them in a bar chart
            const specifiedBoulderGrades = sortedClimbs.map(climb => climb.grade)
            const counts = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
            specifiedBoulderGrades.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
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
        });
    };

    // archives a specific climb by updating the is archived property on the climb object to true and triggers a page re-load which removes the climb from the active view of the main climb page
    const handleArchiveClimb = (climbId) => {
        // user must confirm that they want to archive the climb
        if (window.confirm("Are you sure you want to archive this climb?")) {
            setIsLoading(true);
            ClimbApiManager.getClimbById(climbId).then(climb => {

                const archivedClimb = {
                    id: climbId,
                    userId: activeUserId,
                    gymId: parseInt(climb.gymId),
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

    // deletes a specific climb from the database, updates the climbs in state, and triggers a page re-load
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

     // undoes the archive a specific climb by updating the is archived property on the climb object to false and triggers a page re-load which adds the climb to the active view of the main climb page
    const handleUndoArchiveClimb = (climbId) => {
        setIsLoading(true);
        ClimbApiManager.getClimbById(climbId).then(climb => {

            const activeClimb = {
                id: climbId,
                userId: activeUserId,
                gymId: parseInt(climb.gymId),
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

    // gets the active climbs and gyms after the initial page render
    useEffect(() => {
        getActiveClimbs();
        getGyms();
    }, []);

     // returns the 'add climb', 'filter climbs', 'sort rope climbs by grade', 'sort boulder climbs by grade', 'add gym', & 'view gyms' buttons and all of the active climb cards 
    // the commented out code below was to display a message to the user if they had not created any climbs yet - will revisit this code at a later time

    // if (climbs.length !== 0) {
        return (
            <>
                <div className="add-climb-button-container">

                    <div className="climb-buttons-div">
                        {/* if the 'add climb' button is clicked, execute the checkForGyms function */}
                        <Button type="button" className="add-climb-button"
                            onClick={checkForGyms}>Add Climb</Button>
                        {/* if the 'filter climbs' button is clicked, update the associated states */}
                        <Button type="button" className="sort-climbs-button" onClick={() => { getActiveClimbs(); setIsFiltering(true); setIsSortingRope(false); setIsSortingBoulder(false); }}>Filter Climbs</Button>
                        {/* if the 'sort rope climbs by grade' button is clicked, execute the sortRopeClimbsByGrade function */}
                        <Button type="button" className="sort-climbs-button" onClick={sortRopeClimbsByGrade}>Sort Rope Climbs By Grade</Button>
                        {/* if the 'sort boulder climbs by grade' button is clicked, execute the sortBoulderClimbsByGrade function */}
                        <Button type="button" className="sort-climbs-button" onClick={sortBoulderClimbsByGrade}>Sort Boulder Climbs By Grade</Button>
                        {/* if the user is sorting or filtering the climb data, return the 'back to active climb view' button which when clicked, executes the getActiveClimbs function */}
                        {isFiltering === true || isSorting === true ? <Button type="button" className="sort-climbs-button" onClick={getActiveClimbs}>Back To Active Climb View</Button> : null}
                    </div>

                    <div className="gym-buttons-div">
                        {/* when the 'add gym' button is clicked, re-direct to the 'add a new gym' form */}
                        <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
                        {/* when the 'view gym' button is clicked, re-direct to the main gym list page */}
                        <Button type="button" className="view-gyms-button" onClick={() => { props.history.push("/gyms") }}>View Gyms</Button>
                    </div>

                </div>

                <div className="filter-form-div">
                    {/* if the user clicks the 'filter climbs' button, return the filtering form */}
                    {isFiltering === false ? null :
                        <Form className="filter-climbs-form">

                            {/* form header */}
                            <FormGroup className="filter-climbs-form-header-container">
                                <h6 className="filter-climbs-form-header">Filter Climbs</h6>
                            </FormGroup>

                            <FormGroup className="filter-climbs-form-input-container">
                                {/* filter by climb status */}
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

                                {/* filter by gym */}
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

                                {/* filter by climb type */}
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

                                {/* filter by grade - this input only displays if climb type is selected and it populates based on the climb type selected */}
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

                                {/* filter by enjoyment rating */}
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
                                {/* when the 'close' button is clicked, execute the getActiveClimbs function, which also closes the filtering form */}
                                <Button type="button" size="sm" className="filter-climbs-cancel-button" onClick={getActiveClimbs}>Close</Button>
                            </FormGroup>

                        </Form>
                    }
                </div>

                {/* if the 'sort boulder climbs by grade' button is clicked, return the boulder chart and the active boulder climbs ordered from hardest to easiest; also returns an input field where the user can select to include the archived climbs which will be added to the climb view in real time if the user selects 'yes' */}
                {isSortingBoulder === true ?
                    <>
                        <div className="chart-div">
                            <Bar className="chart" data={boulderChartData} options={{
                                responsive: true,
                                title: { text: "Number of Boulder Climbs by Grade", display: true },
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
                        <div className="filter-chart-div">
                            <Label htmlFor="includeArchivedBoulder" className="climb-label">Include Archived Climbs?</Label>
                            <Input bsSize="sm" id="includeArchivedBoulder"
                                type="select"
                                className="filter-chart-input"
                                name="includeArchivedBoulder"
                                onChange={sortBoulderClimbsByGrade}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </Input>
                        </div>
                    </>
                    : null}

                {/* if the 'sort rope climbs by grade' button is clicked, return the rope chart and the active rope climbs ordered from hardest to easiest; also returns an input field where the user can select to include the archived climbs which will be added to the climb view in real time if the user selects 'yes' */}
                {isSortingRope === true ?
                    <>
                        <div className="chart-div">
                            <Bar className="chart" data={ropeChartData} options={{
                                responsive: true,
                                title: { text: "Number of  Rope Climbs by Grade", display: true },
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
                        <div className="filter-chart-div">
                            <Label htmlFor="includeArchivedRope" className="climb-label">Include Archived Climbs?</Label>
                            <Input bsSize="sm" id="includeArchivedRope"
                                type="select"
                                className="filter-chart-input"
                                name="includeArchivedRope"
                                onChange={sortRopeClimbsByGrade}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </Input>
                        </div>
                    </>
                    : null}

                {/* for each active climb set in the climbs state, return a climb card */}
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
                            {/* for each archived climb set in the climbs state, return an archive card */}
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
    // } else {
    //     return (
    //         <>
    //             <div className="add-climb-button-container">
    //                 <div className="climb-buttons-div">
    //                     <Button type="button" className="add-climb-button"
    //                         onClick={checkForGyms}>Add Climb</Button>
    //                     <Button type="button" className="sort-climbs-button" onClick={getActiveClimbs}>Back To Active Climb View</Button>
    //                 </div>
    //                 <div className="gym-buttons-div">
    //                     <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
    //                     <Button type="button" className="view-gyms-button" onClick={() => { props.history.push("/gyms") }}>View Gyms</Button>
    //                 </div>
    //             </div>
    //             <div className="no-climbs-message-container">
    //                 <Card body className="text-center no-climbs-message-card">
    //                     <CardTitle className="no-climbs-message">You have no saved climbs.</CardTitle>
    //                 </Card>
    //             </div>
    //         </>
    //     )
    // }
};

export default ClimbList;