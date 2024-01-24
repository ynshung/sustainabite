import { Outlet } from "react-router-dom";

const CenterElementMD = () => {
  return (
    <div className="h-full flex-grow flex flex-col justify-center items-stretch">
      <div className="flex flex-col max-w-[24em] w-full my-8 mx-auto">
        <div className="mx-4 text-neutral-900 bg-theme1-50 shadow-lg rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CenterElementMD;
