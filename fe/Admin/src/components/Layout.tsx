import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar";
import { useEffect, useRef, useState } from "react";
import { clearTokens, getTokens, isAccessExpired, saveTokens } from "../util/auth";
import { refresh } from "../service/api/Authenticate";
import { AlertProvider } from "./alert-context";

const MainLayout = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const { pathname } = useLocation();

    // Theo dõi đường dẫn trước đó
    const prevPathRef = useRef<string | null>(null);
    const prevPath = prevPathRef.current;

    const inHomeArea = pathname.toLowerCase().startsWith("/home");
    useEffect(() => {
        const handleAuthCheck = async () => {
            console.log(getTokens());
            if (isAccessExpired() && getTokens()?.refreshToken) {
                try {
                    const res = await refresh();
                    if (res?.data?.data?.accessToken) {
                        saveTokens({
                            accessToken: res.data.data.accessToken,
                            accessTokenAt: res.data.data.accessTokenExpiryAt,
                        });
                        setShowModal(false); // ẩn popup nếu đang show
                    } else {

                        if (inHomeArea) {
                            // Nếu vừa ĐI VÀO /home/** từ trang KHÁC -> về "/" ngay, không popup
                            const cameFromOutsideHome =
                                !prevPath || !prevPath.toLowerCase().startsWith("/home");

                            if (cameFromOutsideHome) {
                                clearTokens();
                                navigate("/", { replace: true });
                            } else {
                                // Đang ở trong /home/** rồi và treo máy -> show popup
                                setShowModal(true);
                            }
                        } else {
                            // Không ở /home/** -> về "/" luôn
                            clearTokens();
                            navigate("/", { replace: true });
                        }
                    }
                } catch (e) {
                    // Lỗi refresh => logout
                    clearTokens();
                    navigate("/", { replace: true });
                }
            } else if (isAccessExpired() && !getTokens()?.refreshToken) {
                if (inHomeArea) {
                    // Nếu vừa ĐI VÀO /home/** từ trang KHÁC -> về "/" ngay, không popup
                    const cameFromOutsideHome =
                        !prevPath || !prevPath.toLowerCase().startsWith("/home");

                    if (cameFromOutsideHome) {
                        clearTokens();
                        navigate("/", { replace: true });
                    } else {
                        // Đang ở trong /home/** rồi và treo máy -> show popup
                        setShowModal(true);
                    }
                } else {
                    // Không ở /home/** -> về "/" luôn
                    clearTokens();
                    navigate("/", { replace: true });
                }
            } else {
                setShowModal(false)
            }

            prevPathRef.current = pathname;
        };

        handleAuthCheck();
    }, [pathname, inHomeArea, navigate]);



    // 2) Interval check + khi tab focus lại (trường hợp treo máy)
    useEffect(() => {
        const check = () => {

            if (isAccessExpired() && !getTokens()?.refreshToken) {
                // Chỉ show popup nếu đang ở trong /home/**
                if (inHomeArea) setShowModal(true);
                else {
                    clearTokens();
                    navigate("/", { replace: true });
                }
            }
        };
        const id = setInterval(check, 30_000);
        window.addEventListener("focus", check);
        return () => {
            clearInterval(id);
            window.removeEventListener("focus", check);
        };
    }, [inHomeArea, navigate]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <SideBar />

            {/* Main content */}
            <div className="flex flex-col flex-1">
                {/* Topbar */}
                <TopBar />

                {/* Page content will render here */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <AlertProvider>
                        <Outlet />
                    </AlertProvider>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
