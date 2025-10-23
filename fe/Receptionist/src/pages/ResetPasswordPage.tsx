import BackgroundLayer from "../components/BackgroundLayer";
import Receptionist from "../components/Receptionist";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden #FFFFFF md:bg-[#F6F3F0]">
            <BackgroundLayer />
            <Receptionist />
            <ResetPasswordForm />
        </div>
    )
};

export default ResetPasswordPage;
