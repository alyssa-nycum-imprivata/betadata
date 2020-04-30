import React, { useState, useEffect } from 'react';
import './Gym.css';
import GymCard from './GymCard';
import GymApiManager from '../../modules/GymApiManager';
import { Button, Card, CardTitle } from 'reactstrap';
import GoalList from '../goals/GoalList';

const GymList = (props) => {

    // gets all gyms created by the logged in user and sets them in state
    const [gyms, setGyms] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getGyms = () => {
        return GymApiManager.getGymsByUser(activeUserId).then(gymsFromApi => {
            setGyms(gymsFromApi)
        });
    };

    // deletes a specific gym from the database, updates the gyms in state, and triggers a page re-load
    const handleGymDelete = (gymId) => {
        // user must confirm that they want to delete the climb
        if (window.confirm("Are you sure you want to delete this gym?")) {
            setIsLoading(true);
            GymApiManager.deleteGym(gymId).then(() => GymApiManager.getGymsByUser(activeUserId).then(gymsFromApi => {
                setGyms(gymsFromApi);
                setIsLoading(false);
            }));
        };
    };

    // gets the gyms after the initial page render
    useEffect(() => {
        getGyms();
    }, []);

    // displays the 'go back to climbs' & 'add gym' buttons and all of the gym cards 
    // the commented out code below was to display a message to the user if they had not created any gyms yet - will revisit this code at a later time

    // if (gyms.length !== 0) {
        return (
            <>
                <div className="add-gym-button-container">
                    <Button type="button" className="go-back-button" onClick={() => { props.history.push("/climbs") }}>Go Back To Climbs</Button>
                    <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
                </div>
                <div className="gym-cards-container">
                    {gyms.map(gym =>
                        <GymCard
                            key={gym.id}
                            gym={gym}
                            isLoading={isLoading}
                            handleGymDelete={handleGymDelete}
                            {...props}
                        />
                    )}
                </div>
            </>
        );
    // } else {
    //     return (
    //         <>
    //             <div className="add-gym-button-container">
    //                 <Button type="button" className="go-back-button" onClick={() => { props.history.push("/climbs") }}>Go Back To Climbs</Button>
    //                 <Button type="button" className="add-gym-button" onClick={() => { props.history.push("/gyms/new") }}>Add Gym</Button>
    //             </div>
    //             <div className="no-gyms-message-container">
    //                 <Card body className="text-center no-gyms-message-card">
    //                     <CardTitle className="no-gyms-message">You have no saved gyms.</CardTitle>
    //                 </Card>
    //             </div>
    //         </>
    //     );
    // };
};

export default GymList;