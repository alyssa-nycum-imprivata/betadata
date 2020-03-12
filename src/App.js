import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../src/components/navbar/Navbar';
import ApplicationViews from './ApplicationViews';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <ApplicationViews />
    </Router>
  );
};

export default App;
