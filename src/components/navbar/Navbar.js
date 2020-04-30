import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {

    // clears session storage when user clicks logout in nav bar
    const handleLogout = () => {
        props.clearUser();
        props.history.push("/");
    };

    // returns links in nav bar based on whether or not a user is logged in
    // if user is not logged in, they should only see the site title in the nav bar
    // if a user is logged in, they should see the site title as well as the home, climbs, goals, and logout tabs
    return (
        <header>
            <h1>
                {props.hasUser
                    ? <Link className="site-title" to="/">BetaData</Link>
                    : "BetaData"}
            </h1>
            <nav>
                <ul className="nav-links-container">
                    {props.hasUser
                        ? <li>
                            <Link className="nav-link" to="/">
                                Home
                        </Link>
                        </li>
                        : null}
                    {props.hasUser
                        ? <li>
                            <Link className="nav-link" to="/climbs">
                                Climbs
                        </Link>
                        </li>
                        : null}
                    {props.hasUser
                        ? <li>
                            <Link className="nav-link" to="/goals">
                                Goals
                        </Link>
                        </li>
                        : null}
                    {props.hasUser
                        ? <li>
                            <Link className="nav-link" to="" onClick={handleLogout}>
                                Logout
                        </Link>
                        </li>
                        : null}
                </ul>
            </nav>
        </header>
    );
};

export default withRouter(Navbar);

