import BackgroundLayer from "../components/BackgroundLayer";
import LoginForm from "../components/LoginForm";
import Receptionist from "../components/Receptionist";

const LoginPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden #FFFFFF md:bg-[#F6F3F0]">
            <BackgroundLayer />
            <Receptionist />
            <LoginForm />
        </div>
    )
};

export default LoginPage;
