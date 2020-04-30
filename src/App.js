import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../src/components/navbar/Navbar';
import ApplicationViews from './ApplicationViews';
import './App.css';

const App = () => {

  // sets session storage with user info for login
  const isAuthenticated = () => sessionStorage.getItem("credentials") !== null;

  const [hasUser, setHasUser] = useState(isAuthenticated());

  const setUser = (user) => {
    sessionStorage.setItem("credentials", JSON.stringify(user));
    setHasUser(isAuthenticated());
  };

  // clears session storage for logout
  const clearUser = () => {
    sessionStorage.clear();
    setHasUser(isAuthenticated());
  };

  // returns the nav bar and main content
  return (
    <Router>
      <NavBar hasUser={hasUser} clearUser={clearUser} />
      <div className="main-content">
        <ApplicationViews hasUser={hasUser} setUser={setUser} />
      </div>
    </Router>
  );
};

export default App;
