import React from 'react';
import { Outlet } from 'react-router-dom';
import Card from '../components/Card';
import Header from '../components/Header';

function AuthLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start
      px-1 py-7 gap-32">
      <Header disabled={true}/>
      <Card maxWidth="447px" maxHeight="559px" className="flex flex-col justify-center items-center p-2.5">
        <Outlet />
      </Card>
    </div>
  );
}

export default AuthLayout;
