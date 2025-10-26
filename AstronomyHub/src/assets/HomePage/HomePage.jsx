import React from 'react';
import './HomePage.css';
import Rocket from './Rocket';

const HomePage = ({ onLoginClick }) => {
  return (
    <section className="homepage-section">
      <div className="nebula nebula-top-right" />
      <div className="nebula nebula-bottom-left" />
      <div className="nebula nebula-center" />

      <div className="homepage-topbar">
        <input className="search-bar" placeholder="Search here"></input>
        <button className="search-btn" >
          Search
        </button>
        <button className="homepage-login-btn" onClick={onLoginClick}>
            Login / Sign Up
          </button>
      </div>

      <div className="homepage-container">
        <div className="homepage-content">
          <div className="rocket-heading">
          {/* <Rocket /> */}
          <h1 className="homepage-title">
            Journey Through
            <br />
            <span className="homepage-title-gradient">
              The Cosmos
            </span>
          </h1>
          </div>
          <p className="homepage-description">
            Discover the wonders of space exploration, celestial phenomena, and the mysteries 
            of our universe. Join fellow astronomers in mapping the stars.
          </p>
          <div className="homepage-stats-grid">
            <div className="homepage-stat">
              <div className="homepage-stat-value">10M+</div>
              <div className="homepage-stat-label">Stars Mapped</div>
            </div>
            <div className="homepage-stat">
              <div className="homepage-stat-value">500+</div>
              <div className="homepage-stat-label">Galaxies</div>
            </div>
            <div className="homepage-stat">
              <div className="homepage-stat-value">24/7</div>
              <div className="homepage-stat-label">Sky Watch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;