import React from 'react';
import { Outlet } from 'react-router-dom';

function GameLayout() {
  return (
    <div className="h-full w-full max-w-[880px] flex justify-center items-center">
        <Outlet />
    </div>
  );
}

export default GameLayout;
