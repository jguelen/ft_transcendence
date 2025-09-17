import React from 'react';
import { Outlet } from 'react-router-dom';

function GridLayout() {
  return (
    <div className="grid gird-cols-2 gap-[20px] grid-rows-2">
        <Outlet />
    </div>
  );
}

export default GridLayout;
