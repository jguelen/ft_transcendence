import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import GridLayout from './layouts/GridLayout';
import GameLayout from './layouts/GameLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Tournament from './pages/game/local/Tournament';
import LocalPong from './pages/game/local/LocalPong';
import OnlinePong from './pages/game/online/OnlinePong';
import Profile from './pages/settings/Profile';
import Account from './pages/settings/Account';
import NotFound from './pages/NotFound';
import Local1v1 from './pages/game/local/Local1v1';
import Ai1v1 from './pages/game/local/Ai1v1';
import Online1v1 from './pages/game/online/Online1v1';
import Online2v2 from './pages/game/online/Online2v2';
import TournamentGame from './pages/game/local/TournamentGame'

// Components
import ProtectedRoute from './components/ProtectedRoute';

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  SETTINGS: {
    PROFILE: 'settings/profile',
    ACCOUNT: 'settings/account',
  },
  CONTEST: {
    TOURNAMENT: '/cup',
  },
  LOCAL: {
    INDEX: '/local-pong',
    PLAY_1V1: '/local-pong/1v1',
    PLAY_AI: '/local-pong/ai',
  },
  ONLINE: {
    INDEX: '/online-pong',
    PLAY_1V1: '/online-pong/1v1',
    PLAY_2V2: '/online-pong/2v2',
  },
};

function App() {
  return (
    <div className="w-full bg-[#060919] bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <div className="h-full w-full relative z-10">
        <BrowserRouter>
          <Routes>
            <Route element={ <AuthLayout/> }>
                <Route path={ROUTES.LOGIN} element={ <Login/> } />
                <Route path={ROUTES.REGISTER} element={ <Register/> } />
            </Route>

            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path={ROUTES.HOME} element={<Home />}/>
              <Route path={ROUTES.LOCAL.INDEX} element={ <LocalPong/> }/>
              <Route path={ROUTES.ONLINE.INDEX} element={ <OnlinePong />}/>
              <Route path={ROUTES.CONTEST.TOURNAMENT} element={  <TournamentGame/> }/>
              <Route element={ <GameLayout/> }>
                <Route path={ROUTES.LOCAL.PLAY_1V1} element={ <Local1v1/> }/>
                <Route path={ROUTES.LOCAL.PLAY_AI} element={ <Ai1v1/> }/>
                <Route path={ROUTES.ONLINE.PLAY_1V1} element={<Online1v1 />}/>
                <Route path={ROUTES.ONLINE.PLAY_2V2} element={<Online2v2 />}/>
              </Route>

              <Route element={<GridLayout/>} >
                <Route path={ROUTES.SETTINGS.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS.ACCOUNT} element={ <Account/> } />
              </Route>
            </Route>

            <Route path="*" element={ <NotFound/> } />

          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
