import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-start flex-1"></div> {/* Creates space on the left */}
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li><Link to="/">Info</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/donate">Donate</Link></li>
          <li><Link to="/balance">Balance</Link></li>
        </ul>
      </div>
      <div className="navbar-end flex-1"></div> {/* Creates space on the right */}
    </div>
  );
}

export default Navbar;
