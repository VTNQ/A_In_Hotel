import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Briefcase,
  Users,
  Building2,
  Lock,
  Boxes,
  ChevronRight,
  ChevronLeft,
  Search,
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
import { clearTokens} from "../util/auth";
import SessionExpiredModal from "./SessionExpiredModal";
import { AlertProvider } from "./alert-context";
import UserDropdown from "./UserDropdown";
import { useAuthWatcher } from "@/hooks/useAuthWatcher";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

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
   const { t } = useTranslation();
   const SECTIONS: SectionSpec[] = [
  {
    title: t("sidebar.dashboards"),
    items: [
      { label: t("sidebar.home"), icon: Home, path: "/Home" },
      { label: t("sidebar.hotel"), icon: Hotel, path: '/Home/hotel' },
      {
        label: t("sidebar.account"),
        icon: Users,
        children: [
          { label: t("sidebar.adminManager"), icon: Briefcase, path: "/Home/Admin" },
          { label: t("sidebar.childSuperAdminManager"), icon: Lock, path: "/Home/ChildSuperAdmin" }
        ],
      },

      {
        label: t("sidebar.systemManagement"),
        icon: Settings,
        children: [
          { label:t("sidebar.aboutHotel"), icon: Hotel, path: "/Home/system-content/about-hotel" },
          { label: t("sidebar.homepageContent"), icon: LayoutDashboard, path: "/Home/system-content/home" },
          { label: t("sidebar.policyTerms"), icon: Lock, path: "/Home/system-content/policy" },
          { label: t("sidebar.footerContent"), icon: Boxes, path: "/Home/system-content/footer" },
        ],
      },
      {
        label:  t("sidebar.facilities"),
        icon: Building2,
        path: "/Home/facility",
      },
    ],
  }
];
  const [showModal, setShowModal] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const navigate = useNavigate();


  useAuthWatcher(setAuthChecking, setShowModal);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  if (authChecking) return null;

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
            <IconBtn label={t("topbar.search")}><Search className="h-5 w-5" /></IconBtn>
            <LanguageSwitcher />
            <IconBtn label="Theme" onClick={() => setDark((v) => !v)}>
              {dark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </IconBtn>
            <IconBtn label="Messages" badge="5"><Mail className="h-5 w-5" /></IconBtn>
            <IconBtn label="Notifications" dot><Bell className="h-5 w-5" /></IconBtn>
            <IconBtn label="Fullscreen"><Maximize2 className="h-5 w-5" /></IconBtn>
            <UserDropdown
              name="Musharof Chowdhury"
              email="randomuser@pimjo.com"
              avatarUrl="https://i.pravatar.cc/40?img=5"
              onProfile={() => navigate("/home/profile")}
              onSettings={() => navigate("/home/account-settings")}
              onLogout={() => {
                clearTokens();
                navigate("/", { replace: true });
              }}
            />

            <IconBtn label="Settings"><Settings className="h-5 w-5" /></IconBtn>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex">
        <Sidebar collapsed={collapsed} sections={SECTIONS} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-6 max-w-[80%]">
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

function isItemActive(item: ItemSpec, pathname: string): boolean {
  if (item.path) {
    // match chính xác
    if (pathname === item.path) return true;

    // match route con, nhưng KHÔNG phải root "/Home"
    if (
      pathname.startsWith(item.path + "/") &&
      item.path !== "/Home"
    ) {
      return true;
    }
  }

  if (item.children) {
    return item.children.some(child =>
      isItemActive(child, pathname)
    );
  }

  return false;
}


function Sidebar({ collapsed, sections, onToggle }: { collapsed: boolean; sections: SectionSpec[]; onToggle: () => void }) {
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
        {sections.map((section, idx) => (
          <SidebarSection key={section.title} section={section} collapsed={collapsed} defaultOpen={idx < 2} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarSection({ section, collapsed, defaultOpen = false }: { section: SectionSpec; collapsed: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { pathname } = useLocation();

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
              <SidebarItem key={item.label} item={item} collapsed={collapsed} depth={0} pathname={pathname} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({
  item,
  collapsed,
  depth,
  pathname,
}: {
  item: ItemSpec;
  collapsed: boolean;
  depth: number;
  pathname: string;
}) {
  const navigate = useNavigate();

  const hasChildren = !!item.children?.length;
  const active = isItemActive(item, pathname);

  // submenu open theo active
  const [open, setOpen] = useState(active);

  useEffect(() => {
    setOpen(active);
  }, [active]);

  const Icon = item.icon ?? Boxes;
  const paddingLeft = useMemo(
    () => (collapsed ? "pl-0" : `pl-${Math.min(2 + depth * 2, 10)}`),
    [collapsed, depth]
  );

  const baseClasses = [
    "group w-full flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors",
    active
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20"
      : "text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
  ].join(" ");

  const handleClick = () => {
    if (hasChildren) {
      setOpen(v => !v);
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <li>
      <button
        className={`${baseClasses} ${paddingLeft} w-full text-left focus:outline-none`}
        onClick={handleClick}
        aria-expanded={hasChildren ? open : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <span className="flex-1 truncate">{item.label}</span>
        )}
        {!collapsed &&
          hasChildren && (
            <ChevronRight
              className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""
                }`}
            />
          )}
      </button>

      {hasChildren && !collapsed && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 space-y-1 border-l border-dashed border-gray-200 pl-4 dark:border-neutral-700"
            >
              {item.children!.map(child => (
                <SidebarItem
                  key={child.label}
                  item={child}
                  collapsed={collapsed}
                  depth={depth + 1}
                  pathname={pathname}
                />
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
  highlighted?: boolean; // e.g. "Utilities" purple pill in the screenshot
  children?: ItemSpec[];
};

