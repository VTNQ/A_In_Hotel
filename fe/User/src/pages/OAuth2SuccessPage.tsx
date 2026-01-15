import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../components/alert-context";
import { saveTokens } from "../util/auth";

export default function OAuth2Success() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return; // CHẶN CHẠY LẦN 2
    handledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const accessTokenExpiryAt = params.get("accessTokenExpiryAt");
    const refreshTokenExpiryAt = params.get("refreshTokenExpiryAt");
    console.log(accessTokenExpiryAt)
    if (accessToken && refreshToken) {
        saveTokens({
            accessToken,
            refreshToken,
            accessTokenAt: Number(accessTokenExpiryAt),
            refreshTokenAt: Number(refreshTokenExpiryAt),
        })

      showAlert({
        title: "Đăng nhập Google thành công",
        type: "success",
        autoClose: 2000,
      });


      navigate("/");
    } else {
      showAlert({
        title: "Đăng nhập Google thất bại",
        type: "error",
      });
      navigate("/login");
    }
  }, [navigate, showAlert]);

  return <div className="p-6 text-center">Đang đăng nhập bằng Google...</div>;
}
