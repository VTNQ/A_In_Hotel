import { Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import HomePage from "./pages/HomePage";
import EventPromotionPage from "./pages/EventPromotionPage";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HotelRoomPage from "./pages/HotelRoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import GalleryPage from "./pages/GalleryPage";
import BookingSuccess from "./pages/BookingSuccess";
import OAuth2Success from "./pages/OAuth2SuccessPage";
import OAuth2Failure from "./pages/OAuth2FailurePage";
import PromotionPage from "./pages/PromotionPage";
import PromotionDetailPage from "./pages/PromotionDetailPage";
import MyBookingsPage from "./pages/MyBookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import BookingPage from "./pages/BookingPage";
import BookingGuard from "./guards/BookingGuard";
import AuthGuard from "./guards/AuthGuard";
import NotFoundPage from "./pages/NotFoundPage";
import FranchiseLandingPage from "./pages/FranchiseLandingPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route path="/oauth2/failure" element={<OAuth2Failure />} />
        <Route path="/event-promotion" element={<EventPromotionPage />} />
        <Route path="/Room" element={<RoomPage />} />
        <Route path="/Hotel/Room/:id" element={<HotelRoomPage />} />
        <Route
          path="/booking"
          element={
            <AuthGuard>
              <BookingGuard>
                <BookingPage />
              </BookingGuard>
            </AuthGuard>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route
          path="/my-booking/:id"
          element={
            <AuthGuard>
              <BookingDetailPage />
            </AuthGuard>
          }
        />
        <Route path="/Room/:id" element={<RoomDetailPage />} />
        <Route path="/franchise" element={<FranchiseLandingPage/>}/>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route
          path="/my-booking"
          element={
            <AuthGuard>
              <MyBookingsPage />
            </AuthGuard>
          }
        />
        <Route path="/promotion/:id" element={<PromotionDetailPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
