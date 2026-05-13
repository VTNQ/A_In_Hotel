import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAlert } from "../components/alert-context";

export default function OAuth2FailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showAlert } = useAlert();
  
  const error = searchParams.get("message") || "Đã có lỗi xảy ra trong quá trình đăng nhập.";

  useEffect(() => {
    showAlert({
      title: "Đăng nhập thất bại",
      description: error,
      type: "error",
      autoClose: 5000,
    });
  }, [error, showAlert]);

  return (
    <div className="min-h-screen bg-[#FBF7F2] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập thất bại
        </h1>
        
        <p className="text-gray-600 mb-8">
          {error}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate("/Login")}
            className="w-full bg-[#b08a66] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#967556] transition-colors"
          >
            Thử lại
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
