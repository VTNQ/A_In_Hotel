# Danh Sách Nhiệm Vụ Cần Thực Hiện (Task List)

Dưới đây là checklist chi tiết để theo dõi tiến độ hoàn thiện mã nguồn và tối ưu hóa hệ thống Admin Portal.

## 🚀 MILESTONE 1: Dọn Dẹp Mã Nguồn & Sửa Lỗi Tĩnh (TypeScript / ESLint)
- [ ] **Task 1.1**: Xóa bỏ route trùng lặp `/booking` thừa tại dòng 36 trong file [App.tsx](src/App.tsx).
- [ ] **Task 1.2**: Chuẩn hóa kiểu dữ liệu cho `src/type/booking.types.tsx` để giảm thiểu các kiểu `any` lỏng lẻo.
- [ ] **Task 1.3**: Chuẩn hóa kiểu dữ liệu cho `src/type/promotion.types.tsx` và `src/type/voucher.types.tsx`.
- [ ] **Task 1.4**: Sửa các file định nghĩa có chứa component/helpers để loại bỏ cảnh báo Fast Refresh `react-refresh/only-export-components`.

## 📦 MILESTONE 2: Nâng Cấp Hệ Thống Bảo Mật & Route Guards
- [ ] **Task 2.1**: Tạo component `<ProtectedRoute />` nhận prop `allowedRoles` để chặn truy cập trái phép.
- [ ] **Task 2.2**: Áp dụng `<ProtectedRoute />` bảo vệ các route dành riêng cho Admin trong [App.tsx](src/App.tsx).
- [ ] **Task 2.3**: Nâng cấp Axios response interceptor trong [http.tsx](src/service/http/http.tsx) để thực hiện Refresh Token tự động và mượt mà hơn khi API trả về lỗi 401.

## 🎨 MILESTONE 3: Hoàn Thiện & Tối Ưu Hóa Trải Nghiệm Đặt Phòng (Booking Flow)
- [ ] **Task 3.1**: Bổ sung hiển thị thông tin chi tiết và trực quan về Voucher khi áp dụng thành công tại [PaymentForm.tsx](src/components/Booking/Create/StepPayment/PaymentForm.tsx).
- [ ] **Task 3.2**: Thêm hiển thị so sánh chênh lệch giá tiền khi đổi phòng trong [SwitchRoomModal.tsx](src/components/Booking/SwitchRoom/SwitchRoomModal.tsx).
- [ ] **Task 3.3**: Bổ sung validation giới hạn sức chứa tối đa của phòng ở bước chọn phòng [StepRoomSelection.tsx](src/components/Booking/Create/StepRoomSelection/StepRoomSelection.tsx).

## 📊 MILESTONE 4: Tinh Chỉnh Biểu Đồ & Tối Ưu Hiệu Năng Trang Dashboard
- [ ] **Task 4.1**: Chuẩn hóa cách format hiển thị tiền tệ (VND/USD) trên các biểu đồ tại [HomePage.tsx](src/page/HomePage.tsx).
- [ ] **Task 4.2**: Cấu hình chế độ hiển thị linh hoạt (Responsive layout) cho ApexCharts và Recharts trên mobile.

## 🌐 MILESTONE 5: Kiểm Tra Trọn Vẹn Đa Ngôn Ngữ (i18n Coverage)
- [ ] **Task 5.1**: Tìm kiếm và thay thế các chuỗi ký tự text cứng (hardcoded text) sang hàm dịch `t('key.name')` trong toàn bộ components.
- [ ] **Task 5.2**: Đồng bộ hóa file ngôn ngữ JSON Anh - Việt trong `src/i18n/` để đảm bảo không bị thiếu cụm từ nào.
