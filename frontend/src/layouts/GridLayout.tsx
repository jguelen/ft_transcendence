import { Outlet } from 'react-router-dom';

function GridLayout() {
  return (
    <div className="grid grid-cols-[154fr_243fr_243fr] gap-[20px]
      grid-rows-[2fr_1fr_1fr] max-h-[684px] h-full max-w-[1600px] w-full">
        <Outlet />
    </div>
  );
}

export default GridLayout;

