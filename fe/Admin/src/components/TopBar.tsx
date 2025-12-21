import { Bell, Menu } from "lucide-react";

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
    return (
        <header className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-4 sm:px-6">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded hover:bg-gray-100"
            >
                <Menu />
            </button>
            <div className="flex items-center gap-4 ml-auto">
                <Bell className="w-5 h-5 text-gray-600" />
                <img src="/asset/avatar.png" className="w-8 h-8 rounded-full" />
            </div>
        </header>
    )
}
export default TopBar;