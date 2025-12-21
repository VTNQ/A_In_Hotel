import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar";
import { AlertProvider } from "./alert-context";
import {
  clearTokens,
} from "../util/auth";
import CommonModal from "./ui/CommonModal";
import { useAuthWatcher } from "../hooks/useAuthWatcher";

const MainLayout = () => {
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAuthWatcher(setAuthChecking, setShowModal);

  if (authChecking) {
    return <div className="w-full h-screen bg-white"></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      <SideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
         <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 sm:p-4 md:p-6 bg-gray-50">
          <AlertProvider>
            <Outlet />
          </AlertProvider>

          <CommonModal
            isOpen={showModal}
            title="Phiên đăng nhập đã hết hạn"
            hideFooter={true} // không dùng footer mặc định
            showCloseButton={false}
            onClose={() => {
              clearTokens();
              setShowModal(false);
              navigate("/", { replace: true });
            }}
            width="w-[450px]"
            height="h-auto"
          >
            <p className="text-gray-600 text-center mb-6">
              Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  clearTokens();
                  setShowModal(false);
                  navigate("/", { replace: true });
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập lại
              </button>
            </div>
          </CommonModal>


        </main>
      </div>
    </div>
  );
};

export default MainLayout;
