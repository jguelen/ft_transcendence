import React from 'react';
import { Outlet } from 'react-router-dom';
import Card from '../components/Card'

function AuthLayout() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2.5">
      <Card maxWidth="447px" maxHeight="559px" className="flex flex-col justify-center items-center p-2.5">
        <Outlet />
      </Card>
    </div>
  );
}

export default AuthLayout;
