import { Menu } from "lucide-react";

interface TopbarProps {
    onToggleMobile: () => void;
}
const AdminTopBar: React.FC<TopbarProps> = ({ onToggleMobile }) => {
    return (
        <header className="h-16 sticky top-0 z-30 bg-white border-b 
    border-indigo-100 shadow-sm px-4 flex items-center gap-3">
            <button
                onClick={onToggleMobile}
                className="lg:hidden inline-flex 
            items-center justify-center rounded-lg
            p-2 text-indigo-700 hover:bg-indigo-100"
            >
                <Menu className="w-5 h-5" />
            </button>
            <div className="font-semibold text-indigo-800">Admin Panel</div>
            <div className="ml-auto flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-200" />
            </div>
        </header>
    )
}
export default AdminTopBar;