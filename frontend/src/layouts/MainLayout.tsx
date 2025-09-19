import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'

function MainLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-1
     py-7 gap-15">
      <Header/>
      <Outlet />
    </div>
  );
}

export default MainLayout;
