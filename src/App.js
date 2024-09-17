import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Movie from './compontents/Movie';
import Screening from './compontents/Screening';
import SeatingBooking from './compontents/SeatingBooking';
import Selling from './compontents/Sellling';

const App = () => {
  return (
    <Router>
      <header className="app-header">
        <h1>Movie Management System</h1>
      </header>
      <div className="container">
        <nav className="nav-buttons">
          <Link to="/movies" className="nav-button">Manage Movies</Link>
          <Link to="/screenings" className="nav-button">Manage Screenings</Link>
          <Link to="/selling" className="nav-button">Manage Selling</Link>
          <Link to="/seating" className="nav-button">Manage Seating</Link>
        </nav>
        <Routes>
          <Route path="/movies" element={<Movie />} />
          <Route path="/screenings" element={<Screening />} />
          <Route path="/selling" element={<SeatingBooking />} />
          <Route path="/seating" element={<Selling />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
