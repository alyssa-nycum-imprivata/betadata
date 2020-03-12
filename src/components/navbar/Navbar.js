import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {
    return (
        <header>
            <h1 className="site-title">
                BetaData
            </h1>
            <nav>
                <ul className="nav-links-container">
                    <li>
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-link" to="/climbs">
                            Climbs
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-link" to="/goals">
                            Goals
                        </Link>
                    </li>
                    <li>
                        <span className="nav-link">
                            Logout
                        </span>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default withRouter(Navbar);

