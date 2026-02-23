import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

function Home() {
    return (
        <div className="home-container">
            <h1 className="home-title">Home</h1>

            <div className="home-actions">
                <Link to={'/signup'} className="home-btn signup-btn">Sign up</Link>
                <Link to={'/login'} className="home-btn login-btn">Login</Link>
            </div>
        </div>
    );
}

export default Home;