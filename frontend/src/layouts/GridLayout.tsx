import React from 'react';
import { Outlet } from 'react-router-dom';

function GridLayout() {
  return (
    <div className="main-layout">
      {/* Votre navigation, header, etc */}
      
      <main className="content">
        <Outlet />
      </main>
      
      {/* Footer ou autres éléments */}
    </div>
  );
}

export default GridLayout;
