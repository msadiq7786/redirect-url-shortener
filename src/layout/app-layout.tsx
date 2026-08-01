import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

function AppLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="w-full h-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
