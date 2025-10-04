import Header from "@/components/header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
