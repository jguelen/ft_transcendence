import { Outlet } from 'react-router-dom';
import Header from '../components/Header'

function MainLayout() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-1
     py-7 gap-8 flex-0">
      <Header/>
      <main className="flex-1 min-h-0 w-full flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
