import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {
    const handleLogout = () => {
        props.clearUser();
        props.history.push("/");
    };

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

