import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LocalPong from './pages/LocalPong';
import OnlinePong from './pages/OnlinePong';
import Parameters from './pages/Parameters';
import Profil from './pages/Profil';
import NotFound from './pages/NotFound';

import PongGame from './pages/PongGame';

// Components
import ProtectedRoute from './components/ProtectedRoute';
// import Card from './components/Card';

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOCAL_PONG: '/local-pong',
  ONLINE_PONG: '/online-pong',
  PARAMETERS: '/parameters',
  PROFILE: '/profile',
};

function App() {
  return (
    <div className="w-full bg-[#060919] bg-[url('./assets/background-clear.svg')] bg-cover bg-center bg-no-repeat">
      <div className="relative z-10">
        <PongGame>
          <h1>test</h1>
        </PongGame>
        <BrowserRouter>
          <Routes>
            {/* Routes d'authentification */}
            <Route path={ROUTES.LOGIN} element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path={ROUTES.REGISTER} element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } />

            {/* Routes protégées avec MainLayout */}
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.LOCAL_PONG} element={<LocalPong />} />
              <Route path={ROUTES.ONLINE_PONG} element={<OnlinePong />} />
              <Route path={ROUTES.PARAMETERS} element={<Parameters />} />
              <Route path={ROUTES.PROFILE} element={<Profil />} />
            </Route>

            {/* Route 404 - avec un layout minimal */}
            <Route path="*" element={
              <AuthLayout>
                <NotFound />
              </AuthLayout>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
