import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'

function MainLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-1
<<<<<<< HEAD
     py-7 gap-24">
=======
     py-7 gap-15">
>>>>>>> 4764653 (avatar)
      <Header/>
      <Outlet />
    </div>
  );
}

export default MainLayout;
