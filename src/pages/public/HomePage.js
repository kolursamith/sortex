import React, { useState, useEffect } from 'react';

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', setFromEvent);
    return () => window.removeEventListener('mousemove', setFromEvent);
  }, []);

  return position;
};

function HomePage() {
  const mousePosition = useMousePosition();

  return (
    <div className="home-container">
      <div
        className="dynamic-mouse"
        style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
      />
      <div className="home-content">
        <h1>Find Your Next Opportunity</h1>
        <p>The one-stop portal for companies, HR professionals, and job seekers.</p>
      </div>
    </div>
  );
}

export default HomePage;