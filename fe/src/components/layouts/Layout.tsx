import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Home/Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer luôn ở đáy */}
      <Footer />
    </div>
  );
};

export default Layout;
