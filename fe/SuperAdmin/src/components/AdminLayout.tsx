import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  BarChart2,
  ShoppingBag,
  HandCoins,
  LineChart,
  Briefcase,
  Users,
  GraduationCap,
  Activity,
  Building2,
  TerminalSquare,
  AppWindow,
  Layers3,
  Lock,
  CircleAlert,
  FileText,
  LayoutList,
  Boxes,
  MapPin,
  Image,
  PieChart,
  Table2,
  ChevronRight,
  ChevronLeft,
  Search,
  Globe,
  Moon,
  SunMedium,
  Bell,
  Mail,
  Maximize2,
  Settings,
  Menu,
  Hotel,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearTokens, getTokens, isAccessExpired, saveTokens } from "../util/auth";
import SessionExpiredModal from "./SessionExpiredModal";
import { AlertProvider } from "./alert-context";
import { refresh } from "@/service/api/Authenticate";

/**
 * AdminLayout
 * - Top Navbar (logo + actions) giống ảnh mẫu
 * - Sidebar trái (collapsible, nested)
 * - Content area responsive
 * - Hỗ trợ Dark mode toggle
 */
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Theo dõi đường dẫn trước đó
  const prevPathRef = useRef<string | null>(null);
  const prevPath = prevPathRef.current;

  const inHomeArea = pathname.toLowerCase().startsWith("/home");
  useEffect(() => {
    const handleAuthCheck = async () => {
      console.log(getTokens());
      if (isAccessExpired() && getTokens()?.refreshToken) {
        try {
          const res = await refresh();
          if (res?.data?.data?.accessToken) {
            saveTokens({
              accessToken: res.data.data.accessToken,
              accessTokenAt: res.data.data.accessTokenExpiryAt,
            });
            setShowModal(false); // ẩn popup nếu đang show
          } else {

            if (inHomeArea) {
              // Nếu vừa ĐI VÀO /home/** từ trang KHÁC -> về "/" ngay, không popup
              const cameFromOutsideHome =
                !prevPath || !prevPath.toLowerCase().startsWith("/home");

              if (cameFromOutsideHome) {
                clearTokens();
                navigate("/", { replace: true });
              } else {
                // Đang ở trong /home/** rồi và treo máy -> show popup
                setShowModal(true);
              }
            } else {
              // Không ở /home/** -> về "/" luôn
              clearTokens();
              navigate("/", { replace: true });
            }
          }
        } catch (e) {
          // Lỗi refresh => logout
          clearTokens();
          navigate("/", { replace: true });
        }
      } else if (isAccessExpired() && !getTokens()?.refreshToken) {
        if (inHomeArea) {
          // Nếu vừa ĐI VÀO /home/** từ trang KHÁC -> về "/" ngay, không popup
          const cameFromOutsideHome =
            !prevPath || !prevPath.toLowerCase().startsWith("/home");

          if (cameFromOutsideHome) {
            clearTokens();
            navigate("/", { replace: true });
          } else {
            // Đang ở trong /home/** rồi và treo máy -> show popup
            setShowModal(true);
          }
        } else {
          // Không ở /home/** -> về "/" luôn
          clearTokens();
          navigate("/", { replace: true });
        }
      } else {
        setShowModal(false)
      }

      prevPathRef.current = pathname;
    };

    handleAuthCheck();
  }, [pathname, inHomeArea, navigate]);



  // 2) Interval check + khi tab focus lại (trường hợp treo máy)
  useEffect(() => {
    const check = () => {

      if (isAccessExpired() && !getTokens()?.refreshToken) {
        // Chỉ show popup nếu đang ở trong /home/**
        if (inHomeArea) setShowModal(true);
        else {
          clearTokens();
          navigate("/", { replace: true });
        }
      }
    };
    const id = setInterval(check, 30_000);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", check);
    };
  }, [inHomeArea, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/60">
        <div className="mx-auto flex h-16  items-center justify-between gap-3 px-4">
          {/* Left: logo + menu button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500" />
              <span className="hidden text-xl font-semibold sm:block">zynix</span>
            </div>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-neutral-800 dark:text-neutral-300"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <IconBtn label="Search"><Search className="h-5 w-5" /></IconBtn>
            <IconBtn label="Language"><Globe className="h-5 w-5" /></IconBtn>
            <IconBtn label="Theme" onClick={() => setDark((v) => !v)}>
              {dark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </IconBtn>
            <IconBtn label="Messages" badge="5"><Mail className="h-5 w-5" /></IconBtn>
            <IconBtn label="Notifications" dot><Bell className="h-5 w-5" /></IconBtn>
            <IconBtn label="Fullscreen"><Maximize2 className="h-5 w-5" /></IconBtn>
            <div className="hidden items-center gap-2 sm:flex">
              <img src="https://i.pravatar.cc/40?img=5" alt="avatar" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">Mr. Jack</span>
            </div>
            <IconBtn label="Settings"><Settings className="h-5 w-5" /></IconBtn>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-6">
          <AlertProvider>
            <Outlet />
          </AlertProvider>

        </main>

      </div>
      <SessionExpiredModal open={showModal} />
    </div>
  );
}

function IconBtn({ children, label, onClick, badge, dot }: { children: React.ReactNode; label: string; onClick?: () => void; badge?: string; dot?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
      aria-label={label}
      title={label}
    >
      {children}
      {badge && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">{badge}</span>
      )}
      {dot && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
      )}
    </button>
  );
}

// --------------------------- Sidebar ----------------------------

const SECTIONS: SectionSpec[] = [
  {
    title: "Dashboards",
    items: [
      { label: "Home", icon: Home, active: true, path: "/Home" },
      { label: "Hotel", icon: Hotel, path: '/Home/hotel' },
      { label: "Banner", icon: Image, active: false, path: "/Home/banner" },
      {
        label: "Account",
        icon: Users,
        children: [
          { label: "Admin Manager", icon: Briefcase, path: "/Home/Admin" },
          { label:"Child SuperAdmin Manager",icon:Lock,path:"/Home/ChildSuperAdmin"}
        ],
      },
      { label: "Analytics", icon: BarChart2 },
      { label: "Ecommerce", icon: ShoppingBag },
      { label: "CRM", icon: HandCoins },
      { label: "Crypto", icon: LineChart },
      { label: "NFT", icon: Layers3 },
      { label: "Projects", icon: Briefcase },
      { label: "Jobs", icon: LayoutList },
      { label: "HRM", icon: Users },
      { label: "Courses", icon: GraduationCap },
      { label: "Stocks", icon: LineChart },
      { label: "Medical", icon: Activity },
      { label: "POS System", icon: Building2 },
      { label: "Podcast", icon: AppWindow },
      { label: "School", icon: GraduationCap },
      { label: "Social Media", icon: Boxes },
      {
        label: "System Management",
        icon: Settings,
        children: [
          {
            label: "System Content",
            icon: FileText,
            children: [
              { label: "About Hotel", icon: Hotel, path: "/Home/system-content/about-hotel" },
              { label: "Banner", icon: Image, path: "/Home/system-content/banner" },
              { label: "Homepage Content", icon: LayoutDashboard, path: "/Home/system-content/home" },
              { label: "Policy & Terms", icon: Lock, path: "/Home/system-content/policy" },
              { label: "Footer Content", icon: Boxes, path: "/Home/system-content/footer" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Web Apps",
    items: [
      { label: "Apps", icon: AppWindow },
      {
        label: "Nested Menu",
        icon: Layers3,
        children: [
          { label: "Level 2 / Reports", icon: FileText },
          { label: "Level 2 / Settings", icon: Lock },
          {
            label: "Level 2 / More",
            icon: Boxes,
            children: [
              { label: "Level 3 / A", icon: FileText },
              { label: "Level 3 / B", icon: FileText },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Crafted",
    items: [
      { label: "Authentication", icon: Lock, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Error", icon: CircleAlert, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Pages", icon: FileText, trailing: <ChevronRight className="h-4 w-4" /> },
    ],
  },
  {
    title: "Modules",
    items: [
      { label: "Forms", icon: TerminalSquare, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Ui Elements", icon: Boxes, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Advanced UI", icon: AppWindow, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Utilities", icon: Search, highlighted: true },
      { label: "Widgets", icon: Boxes },
    ],
  },
  {
    title: "Tools & Components",
    items: [
      { label: "Maps", icon: MapPin, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Icons", icon: Image, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Charts", icon: PieChart, trailing: <ChevronRight className="h-4 w-4" /> },
      { label: "Tables", icon: Table2, trailing: <ChevronRight className="h-4 w-4" /> },
    ],
  },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const widthClass = collapsed ? "w-20" : "w-72";

  return (
    <aside
      className={`${widthClass} sticky top-16 h-[calc(100vh-4rem)] shrink-0 border-r border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/70 transition-[width] duration-300`}
      aria-label="Sidebar"
    >
      {/* Mini header for collapsed control on small viewports */}
      <div className="hidden h-12 items-center justify-end px-2 lg:flex">
        <button
          onClick={onToggle}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="no-scrollbar h-full overflow-y-auto px-2 pb-6">
        {SECTIONS.map((section, idx) => (
          <SidebarSection key={section.title} section={section} collapsed={collapsed} defaultOpen={idx < 2} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarSection({ section, collapsed, defaultOpen = false }: { section: SectionSpec; collapsed: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!collapsed && defaultOpen) setOpen(true);
  }, [collapsed, defaultOpen]);

  return (
    <div className="mb-2">
      <button
        className="mx-1 mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-neutral-500 dark:hover:text-neutral-300"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="truncate text-left">{section.title}</span>
        {!collapsed && <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 px-1"
          >
            {section.items.map((item) => (
              <SidebarItem key={item.label} item={item} collapsed={collapsed} depth={0} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ item, collapsed, depth }: { item: ItemSpec; collapsed: boolean; depth: number }) {
  const [open, setOpen] = useState(item.active || false);
  const hasChildren = !!item.children?.length;
  const Icon = item.icon ?? Boxes;
  const paddingLeft = useMemo(() => (collapsed ? "pl-0" : `pl-${Math.min(2 + depth * 2, 10)}`), [collapsed, depth]);

  const baseClasses = [
    "group w-full flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors",
    item.active
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20"
      : item.highlighted
        ? "bg-indigo-600 text-white shadow hover:bg-indigo-600/90"
        : "text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
  ].join(" ");
  const navigate = useNavigate();
  const handleClick = () => {
    if (hasChildren) {
      // toggle mở submenu
      setOpen((v) => !v)
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const Content = (
    <button
      className={`${baseClasses} ${paddingLeft} w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      onClick={handleClick}
      aria-expanded={hasChildren ? open : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <span className="flex-1 truncate">
          {item.label}
          {item.badge && (
            <span className="ml-2 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-300">
              {item.badge}
            </span>
          )}
        </span>
      )}
      {!collapsed && (item.trailing ?? (hasChildren ? <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} /> : null))}
    </button>
  );

  return (
    <li>
      {Content}
      {hasChildren && !collapsed && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              key="sub"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 space-y-1 border-l border-dashed border-gray-200 pl-4 dark:border-neutral-700"
            >
              {item.children!.map((child) => (
                <SidebarItem key={child.label} item={child} collapsed={collapsed} depth={depth + 1} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

// ---------------------------- Types & Demo -----------------------------

type SectionSpec = { title: string; items: ItemSpec[] };

type ItemSpec = {
  label: string;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  badge?: string;
  path?: string;
  trailing?: React.ReactNode;
  active?: boolean;
  highlighted?: boolean; // e.g. "Utilities" purple pill in the screenshot
  children?: ItemSpec[];
};

