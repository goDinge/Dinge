import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar bg-primary">
      <h1 className="cerealBold">
        <Link to="/">Dinge</Link>
      </h1>
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/investors">Investors</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
