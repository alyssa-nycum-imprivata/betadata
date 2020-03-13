import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../src/components/navbar/Navbar';
import ApplicationViews from './ApplicationViews';
import './App.css';

const App = () => {
  const isAuthenticated = () => sessionStorage.getItem("credentials") !== null; 

  const [hasUser, setHasUser] = useState(isAuthenticated());
  
  const setUser = (user) => {
    sessionStorage.setItem("credentials", JSON.stringify(user));
    setHasUser(isAuthenticated());
  };

  const clearUser = () => {
    sessionStorage.clear();
    setHasUser(isAuthenticated());
  };

  return (
    <Router>
      <NavBar hasUser={hasUser} clearUser={clearUser} />
      <ApplicationViews hasUser={hasUser} setUser={setUser} />
    </Router>
  );
};

export default App;
