import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar";
import { AlertProvider } from "./alert-context";
import {
  clearTokens,
  getTokens,
  isAccessExpired,
  saveTokens,
} from "../util/auth";
import { refresh } from "../service/api/Authenticate";

const MainLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [showModal, setShowModal] = useState(false);

  // Theo dõi đường dẫn trước đó
  const prevPathRef = useRef<string | null>(null);
  const prevPath = prevPathRef.current;

  // Xác định xem đang ở khu vực dashboard
  const inDashboardArea = pathname.toLowerCase().startsWith("/dashboard");

  useEffect(() => {
    const handleAuthCheck = async () => {
      const tokens = getTokens();

      // Nếu access token hết hạn
      if (isAccessExpired()) {
        // Có refresh token => thử refresh
        if (tokens?.refreshToken) {
          try {
            const res = await refresh();
            const newAccess = res?.data?.data?.accessToken;
            const newExpiry = res?.data?.data?.accessTokenExpiryAt;

            if (newAccess) {
              // Lưu lại access token mới
              saveTokens({
                accessToken: newAccess,
                accessTokenAt: newExpiry,
              });
              setShowModal(false);
            } else {
              // Refresh thất bại
              handleSessionExpired();
            }
          } catch (err) {
            handleSessionExpired();
          }
        } else {
          // Không có refresh token => logout
          handleSessionExpired();
        }
      } else {
        // Token còn hạn
        setShowModal(false);
      }

      // Lưu lại path hiện tại
      prevPathRef.current = pathname;
    };

    const handleSessionExpired = () => {
      const cameFromOutside =
        !prevPath || !prevPath.toLowerCase().startsWith("/dashboard");

      if (inDashboardArea) {
        if (cameFromOutside) {
          clearTokens();
          navigate("/", { replace: true });
        } else {
          // Đang trong dashboard và bị hết hạn => show popup
          setShowModal(true);
        }
      } else {
        clearTokens();
        navigate("/", { replace: true });
      }
    };

    handleAuthCheck();
  }, [pathname, inDashboardArea, navigate]);

  // Interval check định kỳ và khi tab được focus lại
  useEffect(() => {
    const check = () => {
      if (isAccessExpired() && !getTokens()?.refreshToken) {
        if (inDashboardArea) setShowModal(true);
        else {
          clearTokens();
          navigate("/", { replace: true });
        }
      }
    };

    const intervalId = setInterval(check, 30_000);
    window.addEventListener("focus", check);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", check);
    };
  }, [inDashboardArea, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1">
        <TopBar />

        <main className="flex-1 p-6 overflow-y-auto relative">
          <AlertProvider>
            <Outlet />
          </AlertProvider>

          {/* Modal hết hạn đăng nhập */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
                <h2 className="text-lg font-semibold mb-3">
                  Phiên đăng nhập đã hết hạn
                </h2>
                <p className="text-gray-600 mb-5">
                  Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
                </p>
                <button
                  onClick={() => {
                    clearTokens();
                    setShowModal(false);
                    navigate("/", { replace: true });
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  Đăng nhập lại
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
