import { Mail, User } from "lucide-react";

const GuestInfo = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] line-clamp-1 font-semibold text-on-surface font-sans">
          Guest Information (Thông tin khách lưu trú)
        </h1>
        <p className="text-[16px] line-clamp-[1.5] font-normal font-sans text-on-surface">
          Vui lòng điền chính xác thông tin để chúng tôi phục vụ bạn tốt nhất.
        </p>
      </div>
      <section className="bg-white border border-[rgb(193,198,215)] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[rgb(235,238,243)] pb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FBF7F2] text-gray-600">
            <User size={18} />
          </div>
          <h2 className="text-[20px] line-clamp-1 font-semibold text-on-surface font-sans">
            Identity Information (Thông tin định danh)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              First Name (Tên)
            </label>
            <input
              type="text"
              placeholder="e.g. Anh"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              Last Name (Họ & Tên đệm)
            </label>
            <input
              type="text"
              placeholder="e.g. Nguyễn"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              ID Number/Passport (CCCD/Hộ chiếu)
            </label>
            <input
              type="text"
              placeholder="0123456789"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              Guest Type (Loại khách)
            </label>
            <select
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            >
              <option>Standard Guest (Khách thông thường)</option>
              <option>VIP Guest (Khách hàng thân thiết)</option>
              <option>Corporate Guest (Khách doanh nghiệp)</option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white border border-[rgb(193,198,215)] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[rgb(235,238,243)] pb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FBF7F2] text-gray-600">
            <Mail size={18} />
          </div>
          <h2 className="text-[20px] line-clamp-1 font-semibold text-on-surface font-sans">
            Contact Information (Thông tin liên hệ)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              Email Address (Hòm thư điện tử)
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              Phone Number (Số điện thoại)
            </label>
            <input
              type="tel"
              placeholder="+84 000 000 000"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              Special Requests (Ghi chú & yêu cầu đặc biệt)
            </label>
            <textarea
              placeholder="Ví dụ: Phòng không hút thuốc, hỗ trợ nhận phòng sớm..."
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md resize-none"
              rows={4}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default GuestInfo;
