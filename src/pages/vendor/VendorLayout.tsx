import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function VendorLayout() {
  return (
    <div className="">
      <Sidebar />

      <div className="lg:ml-24 mx-2 mt-3 ml-[82px] min-h-screen  ">
        <Outlet />
      </div>
    </div>
  );
}

export default VendorLayout;
