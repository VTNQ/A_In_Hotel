import { Outlet } from "react-router-dom";
import Footer from "../Home/Footer";
import Navbar from "../Navbar";
import { AlertProvider } from "../alert-context";
import ContactSticky from "./ContactSticky";

const Layout = () => {
  return (
    <AlertProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 relative">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
        <ContactSticky/>
      </div>
    </AlertProvider>
  );
};

export default Layout;
