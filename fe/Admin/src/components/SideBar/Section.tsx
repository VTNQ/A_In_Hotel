import {
  BedDouble,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  NotebookPen,
  TicketPercent,
  UserCog,
  Users,
} from "lucide-react";

export const SECTIONS = [
  {
    title: null,
    items: [
      {
        label: "sideBar.DashBoard",
        icon: LayoutDashboard,
        path: "/Dashboard",
        roles: ["ADMIN", "RECEPTIONIST"],
      },
      {
        label: "sideBar.booking",
        icon: BedDouble,
        path: "/Dashboard/booking",
        roles: ["ADMIN", "RECEPTIONIST"],
      },
      {
        label: "sideBar.facility",
        icon: Building2,
        children: [
          {
            label: "sideBar.room",
            path: "/Dashboard/facility/room",
            roles: ["ADMIN", "RECEPTIONIST"],
          },
          {
            label: "sideBar.asset",
            path: "/Dashboard/facility/asset",
            roles: ["ADMIN"],
          },
          {
            label: "sideBar.extra",
            path: "/Dashboard/facility/service",
            roles: ["ADMIN"],
          },
          {
            label: "sideBar.category",
            path: "/Dashboard/facility/category",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "sideBar.user",
        icon: Users,
        path: "/Dashboard/customer",
        roles: ["ADMIN"],
      },
      {
        label: "sideBar.staff",
        icon: UserCog,
        path: "/Dashboard/staff",
        roles: ["ADMIN"],
      },
      {
        label: "sideBar.post",
        icon: NotebookPen,
        children: [
          { label: "sideBar.blog", path: "/Dashboard/post/blog" },
          { label: "sideBar.banner", path: "/Dashboard/post/banner" },
        ],
        roles: ["ADMIN"],
      },
      {
        label: "sideBar.coupon",
        icon: TicketPercent,
        roles:["ADMIN"],
        children: [
          {
            label: "sideBar.promotion",
            icon: Megaphone,
            path: "/Dashboard/coupon/promotion",
          },
          {
            label: "sideBar.voucher",
            icon: Megaphone,
            path: "/Dashboard/coupon/voucher",
          },
        ],
      },
      { label: "sideBar.reportings",roles:["ADMIN"], icon: FileText },
    ],
  },
  {
    title: null,
    roles:["ADMIN","RECEPTIONIST"],
    items: [{ label: "sideBar.logout", icon: LogOut, action: "LOGOUT" }],
  },
];
