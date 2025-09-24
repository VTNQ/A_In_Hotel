// components/SessionExpiredModal.tsx
import { useNavigate } from "react-router-dom";

export default function SessionExpiredModal({
  open,
}: { open: boolean }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleClick = () => {
    // xóa token nếu muốn
    localStorage.removeItem("tokens");
    // chuyển về trang login
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        <h3 className="mb-1 text-lg font-semibold">Phiên đăng nhập đã hết hạn</h3>
        <p className="mb-4 text-sm text-gray-600">
          Vui lòng đăng nhập lại để tiếp tục.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={handleClick}
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
}
