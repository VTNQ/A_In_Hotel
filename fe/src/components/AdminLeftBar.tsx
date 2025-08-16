import { BarChart3, FolderOpen, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
const AdminLeftBar = () => {
    const location = useLocation();
    const menu = [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
        { label: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
        { label: 'Projects', path: '/admin/projects', icon: <FolderOpen className="w-5 h-5" /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> }
    ]
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 
                    flex items-center justify-center">
                        <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-800 text-lg">Admin</span>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
                {menu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            
                            `}
                        >
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center
                  ${isActive
                                        ? 'bg-indigo-300 text-indigo-900'
                                        : 'bg-indigo-200 text-indigo-700'
                                    }
                `}
                            >
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={() => console.log("Sign Out")}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <span>Sign out</span>
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                    &copy; 2025 <span className="font-semibold text-gray-500">My Admin Panel</span>
                </p>
            </div>
        </div>
    )
}
export default AdminLeftBar