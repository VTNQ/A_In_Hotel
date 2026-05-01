import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearTokens, getTokens, saveTokens } from "../util/auth";
import { refresh } from "../service/api/Authenticate";

export const useAuthWatcher = (
  setAuthChecking: (v: boolean) => void,
  setShowModal: (v: boolean) => void,
) => {
  const navigate = useNavigate();
  const location = useLocation();

  // =============================
  // 🔥 CHECK 1 LẦN LÚC MỞ TRANG
  // =============================
  const receptionAllowPages = [
    "/Dashboard/facility/room",
    "/Dashboard/booking",
    "/Dashboard"
    
  ];
  useEffect(() => {
    const initCheck = async () => {
      const tokens = getTokens();

      if (!tokens) {
        clearTokens();
        navigate("/", { replace: true });
        return;
      }
      if(tokens.role ==="RECEPTIONIST" && 
        !receptionAllowPages.includes(location.pathname)
      ){
        navigate(-1);
        return;
      }
      const remain = tokens.accessTokenAt - Date.now();

      // Token gần hết hạn → refresh
      if (remain <= 10_000) {
        try {
          const res = await refresh();
          if (res?.data?.data?.accessToken) {
            saveTokens({
              ...tokens,
              accessToken: res.data.data.accessToken,
              accessTokenAt: res.data.data.accessTokenExpiryAt,
              refreshToken: undefined,
              refreshTokenAt: undefined,
            });
          } else {
            clearTokens();
            navigate("/", { replace: true });
            return;
          }
        } catch {
          clearTokens();
          navigate("/", { replace: true });
          return;
        }
      }

      setAuthChecking(false);
    };

    initCheck();
  }, [navigate, setAuthChecking]);

  useEffect(() => {
    const checkToken = async () => {
      const tokens = getTokens();
      if (!tokens) {
        clearTokens();
        navigate("/", { replace: true });
        return;
      }

      const remain = tokens.accessTokenAt - Date.now();

      // 🟡 Sắp hết hạn access token
      if (remain <= 10_000 && remain > 0 && tokens.refreshToken) {
        try {
          const res = await refresh();
          if (res?.data?.data?.accessToken) {
            saveTokens({
              ...tokens,
              accessToken: res.data.data.accessToken,
              accessTokenAt: res.data.data.accessTokenExpiryAt,
              refreshToken: undefined,
              refreshTokenAt: undefined,
            });
          } else {
            setShowModal(true);
          }
        } catch {
          setShowModal(true);
        }
        return;
      }

      // 🔴 Access hết hạn + không có refresh
      if (remain <= 0 && !tokens.refreshToken) {
        setShowModal(true);
        return;
      }
    };

    const id = setInterval(checkToken, 5000);
    window.addEventListener("focus", checkToken);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", checkToken);
    };
  }, [navigate, setShowModal]);
};
