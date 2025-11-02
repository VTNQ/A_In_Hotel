import { Bell, ChevronDown } from "lucide-react";

const TopBar = () => {
    const user = {
        name: 'Thien Nguyen',
        role: 'Admin',
        avatar: '/asset/avatar.png'
    }
    return (
        <header className="flex items-center justify-end w-full h-14 bg-white border-b border-gray-200 px-6">
       <button className="relative flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-50 transition mr-9">
      <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800" />
      {/* Chấm đỏ nhỏ hiển thị số lượng thông báo */}
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                        {user.name}
                    </p>
                    <p className="text-xs text-gray-400 -mt-0.5 text-left">{user.role}</p>
                </div>
                <ChevronDown size={18} className="text-gray-500 cursor-pointer" />

            </div>
        </header>
    )
}
export default TopBar;