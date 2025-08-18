import { Bell, Globe2, Mail, Maximize2, Menu, Moon, Search, Settings } from "lucide-react";

interface TopbarProps {
    onToggleMobile: () => void;
}
const AdminTopBar: React.FC<TopbarProps> = ({ onToggleMobile }) => {
    const ICON_STYLE = "w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700";
    return (
          <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm px-4 flex items-center">
      {/* Logo + menu toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="zynix" className="h-6 w-6" />
          <span className="font-semibold text-lg tracking-tight">zynix</span>
        </div>
        <button
          onClick={onToggleMobile}
          className="lg:hidden ml-2 inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-4">
        <Search className={ICON_STYLE} />
        <Globe2 className={ICON_STYLE} />
        <Moon className={ICON_STYLE} />
        <div className="relative">
          <Mail className={ICON_STYLE} />
          <span className="absolute -top-1 -right-2 h-4 w-4 text-[10px] flex items-center justify-center rounded-full bg-violet-600 text-white">5</span>
        </div>
        <Bell className={ICON_STYLE} />
        <Maximize2 className={ICON_STYLE} />
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/avatar.jpg" alt="avatar" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-sm font-medium text-slate-700">Mr. Jack</span>
        </div>
        <Settings className={ICON_STYLE} />
      </div>
    </header>
    )
}
export default AdminTopBar;