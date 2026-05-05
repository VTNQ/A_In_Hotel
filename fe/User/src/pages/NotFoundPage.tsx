import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-[#FBF7F2] dark:bg-[#121212] text-slate-800
        dark:text-slate-100 transition-colors duration-300"
    >
      <div className="max-w-8xl w-full text-center relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div
          className="absolute inset-0 z-10 opacity-10 blur-3xl bg-[rgb(216,226,255)] flex
                items-center justify-center"
        >
          <div className="w-96 h-96 rounded-xl bg-[rgb(216,226,255)]"></div>
        </div>
        <h1
          className="text-[120px] md:text-[200px] leading-none font-extrabold tracking-tighter
                text-on-surface opacity-20 mb-[40px] select-none"
        >
          404
        </h1>
        <div className="relative z-10">
          <h2 className="font-sans text-[28px] text-on-surface mb-4">
            Có vẻ như bạn đã đi lạc
          </h2>
          <p className="font-sans text-[16px] text-[rgb(87,95,103)] max-w-2xl mx-auto mb-10">
            Trang này hiện không khả dụng. Hãy để chúng tôi dẫn bạn trở lại
            không gian nghỉ dưỡng tuyệt vời tại LuxeResort.
          </p>
          <button onClick={()=>navigate("/")} className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-lg font-button text-button hover:bg-primary-container transition-all duration-300 shadow-md">
                Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
