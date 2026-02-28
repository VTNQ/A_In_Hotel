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
  BedDouble,
  UserCog,
  TicketPercent,
  Megaphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearTokens } from "../util/auth";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const SECTIONS: SectionSpec[] = [
    {
      title: t("sidebar.dashboards"),
      items: [
        {
          label: t("sidebar.home"),
          icon: Home,
          path: "/Home",
        },
        {
          label: t("sidebar.booking"),
          icon: BedDouble,
          path: "/Home/booking",
        },
        { label: t("sidebar.user"), icon: Users, path: "/Home/customer" },
        {
          label: t("sidebar.staff"),
          icon: UserCog,
          path: "/Home/staff",
        },
        {
          label: t("sidebar.coupon"),
          icon: TicketPercent,
          children: [
            {
              label: t("sidebar.promotion"),
              icon: Megaphone,
              path: "/Home/coupon/promotion",
            },
            {
              label: t("sidebar.voucher"),
              icon: Megaphone,
              path: "/Home/coupon/voucher",
            },
          ],
        },
      ],
    },

    {
      title: t("sidebar.hotelManagement"),
      items: [
        {
          label: t("sidebar.hotel"),
          icon: Hotel,
          path: "/Home/hotel",
        },
        {
          label: t("sidebar.facilities"),
          icon: Building2,
          path: "/Home/facility",
        },
      ],
    },

    {
      title: t("sidebar.facilityManagement"),
      items: [
        {
          label: t("sidebar.facility"),
          icon: Building2,
          children: [
            { label: t("sidebar.room"), path: "/Home/room" },
            { label: t("sidebar.asset"), path: "/Home/asset" },
            { label: t("sidebar.extra"), path: "/Home/service" },
            { label: t("sidebar.category"), path: "/Home/category" },
          ],
        },
      ],
    },
    {
      title: t("sidebar.post"),
      items: [
        {
          label: t("sidebar.blog"),
          path: "/Home/post/blog",
        },
        {
          label: t("sidebar.banner"),
          path: "/Home/post/banner",
        },
      ],
    },

    {
      title: t("sidebar.userPermission"),
      items: [
        {
          label: t("sidebar.account"),
          icon: Users,
          children: [
            {
              label: t("sidebar.adminManager"),
              icon: Briefcase,
              path: "/Home/Admin",
            },
            {
              label: t("sidebar.childSuperAdminManager"),
              icon: Lock,
              path: "/Home/ChildSuperAdmin",
            },
          ],
        },
      ],
    },

    {
      title: t("sidebar.systemManagement"),
      items: [
        {
          label: t("sidebar.systemContent"),
          icon: Settings,
          children: [
            {
              label: t("sidebar.aboutHotel"),
              icon: Hotel,
              path: "/Home/system-content/about-hotel",
            },
            {
              label: t("sidebar.homepageContent"),
              icon: LayoutDashboard,
              path: "/Home/system-content/home",
            },
            {
              label: t("sidebar.policyTerms"),
              icon: Lock,
              path: "/Home/system-content/policy",
            },
            {
              label: t("sidebar.footerContent"),
              icon: Boxes,
              path: "/Home/system-content/footer",
            },
          ],
        },
      ],
    },
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
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/70">
        <div className="flex h-16 items-center justify-between px-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500" />
              <span className="hidden sm:block text-xl font-semibold">
                zynix
              </span>
            </div>

            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(true);
                } else {
                  setCollapsed((v) => !v);
                }
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <IconBtn label="Theme" onClick={() => setDark((v) => !v)}>
              {dark ? <SunMedium size={18} /> : <Moon size={18} />}
            </IconBtn>

            <LanguageSwitcher />

            <UserDropdown
              name="Admin"
              email="admin@email.com"
              avatarUrl="https://i.pravatar.cc/40?img=5"
              onLogout={() => {
                clearTokens();
                navigate("/", { replace: true });
              }}
            />
          </div>
        </div>
      </header>

      {/* ================= LAYOUT ================= */}
      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          sections={SECTIONS}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((v) => !v)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <AlertProvider>
            <Outlet />
          </AlertProvider>
        </main>
      </div>

      <SessionExpiredModal open={showModal} />
    </div>
  );


}

function IconBtn({
  children,
  label,
  onClick,
  badge,
  dot,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: string;
  dot?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
      aria-label={label}
      title={label}
    >
      {children}
      {badge && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
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
    if (pathname.startsWith(item.path + "/") && item.path !== "/Home") {
      return true;
    }
  }

  if (item.children) {
    return item.children.some((child) => isItemActive(child, pathname));
  }

  return false;
}

function Sidebar({
  collapsed,
  sections,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  sections: SectionSpec[];
  onToggle: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const widthClass = collapsed ? "w-20" : "w-72";

  return (
    <>
      {/* 🔹 Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        aria-label="Sidebar"
        className={`
        ${widthClass}
        fixed lg:sticky
        top-0 lg:top-16
        left-0
        h-full lg:h-[calc(100vh-4rem)]
        z-50 lg:z-0
        border-r border-gray-200 dark:border-neutral-800
        bg-white dark:bg-neutral-950
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        flex flex-col
      `}
      >
        {/* 🔹 Mobile header */}
        <div className="flex items-center justify-between p-3 lg:hidden border-b dark:border-neutral-800">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* 🔹 Desktop collapse button */}
        <div className="hidden lg:flex h-12 items-center justify-end px-2">
          <button
            onClick={onToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg
          border border-gray-200 dark:border-neutral-800
          bg-white dark:bg-neutral-900
          text-gray-700 dark:text-neutral-200
          shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* 🔹 Scrollable menu */}
        <nav className="flex-1 overflow-y-auto px-2 pb-6 no-scrollbar">
          {sections.map((section, idx) => (
            <SidebarSection
              key={section.title}
              section={section}
              collapsed={collapsed}
              defaultOpen={idx < 2}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarSection({
  section,
  collapsed,
  defaultOpen = false,
}: {
  section: SectionSpec;
  collapsed: boolean;
  defaultOpen?: boolean;
}) {
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
        {!collapsed && (
          <ChevronRight
            className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
          />
        )}
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
              <SidebarItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                depth={0}
                pathname={pathname}
              />
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
    [collapsed, depth],
  );

  const baseClasses = [
    "group w-full flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors",
    active
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20"
      : "text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
  ].join(" ");

  const handleClick = () => {
    if (hasChildren) {
      setOpen((v) => !v);
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
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {!collapsed && hasChildren && (
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-90" : ""
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
              {item.children!.map((child) => (
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
  icon?: React.ComponentType<React.ComponentProps<"svg">>;
  badge?: string;
  path?: string;
  trailing?: React.ReactNode;
  highlighted?: boolean; // e.g. "Utilities" purple pill in the screenshot
  children?: ItemSpec[];
};
