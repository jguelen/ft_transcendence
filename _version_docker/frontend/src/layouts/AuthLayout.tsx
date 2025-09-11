import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="h-full w-full flex items-center justify-center"
       style={{
        paddingLeft: 'clamp(1rem, calc((100vw - 450px) / 2), 46rem)',
        paddingRight: 'clamp(1rem, calc((100vw - 450px) / 2), 46rem)',
        paddingTop: 'clamp(1rem, calc((100vh - 560px) / 2), 16rem)',
        paddingBottom: 'clamp(1rem, calc((100vh - 560px) / 2), 16rem)'
      }}
      >
        <Outlet />
    </div>
  );
}

export default AuthLayout;
