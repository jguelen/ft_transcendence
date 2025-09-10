import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'

function MainLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-2.5 border border-blue-500
      gap-32">
      <Header/>
      <Outlet />
    </div>
  );
}

export default MainLayout;
