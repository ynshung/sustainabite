import { Outlet } from "react-router-dom";

const CenterElement = () => {
  return (
    <div className="h-full flex-grow flex flex-col justify-center">
      <div className="flex flex-col w-[24em] my-8 content-center rounded-xl text-neutral-900 bg-theme1-50 mx-auto shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default CenterElement;
