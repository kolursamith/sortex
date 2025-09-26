import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  let currentLink = '';

  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  const crumbs = location.pathname.split('/')
    .filter(crumb => crumb !== '')
    .map(crumb => {
      currentLink += `/${crumb}`;
      // Capitalize the first letter for display
      const crumbName = crumb.charAt(0).toUpperCase() + crumb.slice(1);
      return (
        <div className="crumb" key={crumb}>
          <NavLink to={currentLink}>{crumbName}</NavLink>
        </div>
      );
    });

  return (
    <nav className="breadcrumbs-nav">
      <div className="crumb">
        <NavLink to="/">Home</NavLink>
      </div>
      {crumbs}
    </nav>
  );
}

export default Breadcrumbs;
