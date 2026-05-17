import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import BookingGuard from "./guards/BookingGuard";
import AuthGuard from "./guards/AuthGuard";

const HomePage = lazy(() => import("./pages/HomePage"));
const EventPromotionPage = lazy(() => import("./pages/EventPromotionPage"));
const RoomPage = lazy(() => import("./pages/RoomPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HotelRoomPage = lazy(() => import("./pages/HotelRoomPage"));
const RoomDetailPage = lazy(() => import("./pages/RoomDetailPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const OAuth2Success = lazy(() => import("./pages/OAuth2SuccessPage"));
const OAuth2Failure = lazy(() => import("./pages/OAuth2FailurePage"));
const PromotionPage = lazy(() => import("./pages/PromotionPage"));
const PromotionDetailPage = lazy(() => import("./pages/PromotionDetailPage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingPage"));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const FranchiseLandingPage = lazy(() => import("./pages/FranchiseLandingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

// A simple loading fallback for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/franchise" element={<FranchiseLandingPage />} />
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
    </Suspense>
  );
}

export default App;
