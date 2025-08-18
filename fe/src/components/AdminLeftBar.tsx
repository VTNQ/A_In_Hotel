import { AlertCircle, AppWindow, BarChart3, ChevronDown, ChevronRight, FileText, FolderOpen, Home, ImageIcon, LayoutDashboard, MapPinned, Puzzle, ShieldCheck, Table2 } from "lucide-react";
import { useState, type JSX } from "react";
import { Link, useLocation } from "react-router-dom"

const AdminLeftBar = () => {
    const location = useLocation();
    const [dashboardOpen, setDashboardOpen] = useState(true);
    const isActive = (path: string) => location.pathname === path;
    type Item = {
        label: string,
        path: string
       icon?: JSX.Element;
    hasChildren?: boolean;
    }
   const dashboardChildren: Item[] = [
    { label: "Sales", path: "/admin/dashboards/sales" },
    { label: "Analytics", path: "/admin/dashboards/analytics" },
    { label: "Ecommerce", path: "/admin/dashboards/ecommerce" },
    { label: "CRM", path: "/admin/dashboards/crm" },
    { label: "Crypto", path: "/admin/dashboards/crypto" },
    { label: "NFT", path: "/admin/dashboards/nft" },
    { label: "Projects", path: "/admin/dashboards/projects" },
    { label: "Jobs", path: "/admin/dashboards/jobs" },
    { label: "HRM", path: "/admin/dashboards/hrm" },
    { label: "Courses", path: "/admin/dashboards/courses" },
    { label: "Stocks", path: "/admin/dashboards/stocks" },
    { label: "Medical", path: "/admin/dashboards/medical" },
    { label: "POS System", path: "/admin/dashboards/pos" },
    { label: "Podcast", path: "/admin/dashboards/podcast" },
    { label: "School", path: "/admin/dashboards/school" },
    { label: "Social Media", path: "/admin/dashboards/social" },
  ];

  const sections: { title: string; items: Item[] }[] = [
    {
      title: "WEB APPS",
      items: [
        { label: "Apps", path: "/admin/apps", icon: <AppWindow className="h-4 w-4" />, hasChildren: true },
        { label: "Nested Menu", path: "/admin/nested", icon: <FolderOpen className="h-4 w-4" />, hasChildren: true },
      ],
    },
    {
      title: "CRAFTED",
      items: [
        { label: "Authentication", path: "/admin/auth", icon: <ShieldCheck className="h-4 w-4" />, hasChildren: true },
        { label: "Error", path: "/admin/error", icon: <AlertCircle className="h-4 w-4" />, hasChildren: true },
        { label: "Pages", path: "/admin/pages", icon: <FileText className="h-4 w-4" />, hasChildren: true },
      ],
    },
    {
      title: "MODULES",
      items: [
        { label: "Forms", path: "/admin/forms", icon: <LayoutDashboard className="h-4 w-4" />, hasChildren: true },
        { label: "Ui Elements", path: "/admin/ui", icon: <Puzzle className="h-4 w-4" />, hasChildren: true },
        { label: "Advanced UI", path: "/admin/advanced", icon: <Puzzle className="h-4 w-4" />, hasChildren: true },
        { label: "Utilities", path: "/admin/utilities", icon: <Puzzle className="h-4 w-4" />, hasChildren: true },
        { label: "Widgets", path: "/admin/widgets", icon: <Puzzle className="h-4 w-4" />, hasChildren: true },
      ],
    },
    {
      title: "TOOLS & COMPONENTS",
      items: [
        { label: "Maps", path: "/admin/maps", icon: <MapPinned className="h-4 w-4" />, hasChildren: true },
        { label: "Icons", path: "/admin/icons", icon: <ImageIcon className="h-4 w-4" />, hasChildren: true },
        { label: "Charts", path: "/admin/charts", icon: <BarChart3 className="h-4 w-4" />, hasChildren: true },
        { label: "Tables", path: "/admin/tables", icon: <Table2 className="h-4 w-4" />, hasChildren: true },
      ],
    },
  ];
  return(
   <aside className="w-64 h-screen bg-white border-r border-slate-200/80 shadow-sm flex flex-col">
      {/* Brand */}
      <div className="h-16 px-6 flex items-center border-b border-slate-200/80">
        <div className="flex items-center gap-3 select-none">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-violet-600" />
          </div>
          <div className="font-semibold text-lg tracking-tight">zynix</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Section: Dashboards (special pill header) */}
        <div className="mb-6">
          <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Dashboards</div>

          <button
            onClick={() => setDashboardOpen((v) => !v)}
            className="w-full relative flex items-center justify-between gap-2 rounded-xl bg-violet-600/10 hover:bg-violet-600/15 transition p-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-slate-800">Dashboards</span>
            </div>
            {dashboardOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {dashboardOpen && (
            <ul className="mt-3 pl-3">
              {dashboardChildren.map((d) => (
                <li key={d.path}>
                  <Link
                    to={d.path}
                    className={[
                      "relative block rounded-lg px-3 py-2 text-sm transition",
                      isActive(d.path)
                        ? "bg-violet-600/10 text-violet-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {isActive(d.path) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-violet-500" />
                    )}
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Generic sections */}
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={[
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                      isActive(item.path)
                        ? "bg-violet-600/10 text-violet-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-violet-500" />
                    )}
                    <div
                      className={[
                        "h-6 w-6 rounded-full flex items-center justify-center",
                        isActive(item.path)
                          ? "bg-violet-500/20 text-violet-700"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {item.icon}
                    </div>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.hasChildren && (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/80 px-4 py-3 text-[11px] text-center text-slate-400">
        © 2025 <span className="font-semibold text-slate-500">My Admin Panel</span>
      </div>
    </aside>
  )
}
export default AdminLeftBar;