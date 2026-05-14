# Danh sách các task cần thực hiện (TODO List)

Dưới đây là các đầu việc cần triển khai để hoàn thiện hệ thống đặt phòng khách sạn.

## 1. Xác thực & Quản lý người dùng (Authentication & User)
- [ ] **Quên mật khẩu:** Bổ sung luồng "Forgot Password" (Gửi email, nhập mã OTP/Link reset).
- [ ] **Đổi mật khẩu:** Thêm chức năng đổi mật khẩu trong trang `ProfilePage`.
- [ ] **Xử lý lỗi OAuth2:** Thêm trang hoặc thông báo lỗi khi đăng nhập Google/Facebook thất bại.
- [ ] **Bảo mật Route:** Kiểm tra và áp dụng `guards` cho tất cả các route yêu cầu quyền riêng tư.

## 2. Quy trình Đặt phòng (Booking Workflow)
- [ ] **Tích hợp Voucher:** Kết nối `BookingPage` với API Voucher thực tế để áp dụng giảm giá.
- [ ] **Chính sách hủy phòng:** Hiển thị rõ ràng các quy định hoàn tiền khi hủy phòng.
- [ ] **Thanh toán trực tuyến:** Tích hợp các cổng thanh toán (VNPay, Momo, Stripe).
- [ ] **Đồng bộ thời gian giữ phòng:** Đảm bảo countdown đồng bộ với backend.

## 3. Tìm kiếm & Chi tiết phòng (Room & Search)
- [ ] **Bộ lọc nâng cao:** Hoàn thiện lọc theo tiện ích, khoảng giá, và số lượng khách.
- [ ] **Kiểm tra phòng trống:** Kết nối API check availability theo thời gian thực.
- [ ] **Đánh giá & Bình luận:** Xây dựng tính năng cho khách hàng đánh giá sau khi trả phòng.
- [ ] **Bản đồ tương tác:** Tích hợp bản đồ hiển thị vị trí khách sạn và các điểm lân cận.

## 4. Trang Cá nhân & Lịch sử (Profile & History)
- [ ] **Lịch sử đặt phòng:** Hoàn thiện trang `MyBookingPage` (Sắp tới, Đã xong, Đã hủy).
- [ ] **Hệ thống điểm thưởng (Rewards):** Triển khai tích điểm và đổi thưởng.
- [ ] **Xuất hóa đơn/Xác nhận:** Cho phép tải file PDF xác nhận đặt phòng.

## 5. Tối ưu UI/UX & Kỹ thuật
- [ ] **Đa ngôn ngữ (i18n):** Hỗ trợ chuyển đổi Tiếng Anh - Tiếng Việt toàn diện.
- [ ] **Dark Mode:** Thêm giao diện tối cho ứng dụng.
- [ ] **Skeleton Loaders:** Áp dụng cho tất cả các trang danh sách và chi tiết.
- [ ] **Tối ưu hiệu năng:** Lazy load hình ảnh, tối ưu hóa bundle size.
- [ ] **PWA:** Cấu hình để ứng dụng có thể cài đặt trên mobile.

## 6. Trang Khuyến mãi & Nội dung
- [ ] **Trang Franchise:** Hoàn thiện giao diện và nội dung cho `FranchiseLandingPage`.
- [ ] **Chi tiết khuyến mãi:** Kết nối dữ liệu động cho các sự kiện ưu đãi.
