import React from 'react';
import { Outlet } from 'react-router-dom';

function GameLayout() {
  return (
    <div className="h-full main-layout">
      {/* Votre navigation, header, etc */}
      
      <main className="h-full content">
        <Outlet />
      </main>
      
      {/* Footer ou autres éléments */}
    </div>
  );
}

export default GameLayout;
