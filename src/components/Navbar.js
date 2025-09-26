import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'candidate': return '/candidate-dashboard';
      case 'company': return '/company-dashboard';
      case 'hr': return '/hr-dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">SORTEX</NavLink>
      <ul className="nav-links">
        {user ? (
          <>
            <li><NavLink to={getDashboardLink()}>Dashboard</NavLink></li>
            <li><button onClick={handleLogout} className="nav-logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/signup" className="nav-signup-btn">Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;