import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />}/>
                  
                <Route path="/reset" element={<ResetPasswordPage />} />
            </Routes>
        </>
    )
}
export default App;