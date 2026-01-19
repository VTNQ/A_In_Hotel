import { BedDouble, Building2, FileText, LayoutDashboard, LogOut, NotebookPen, UserCog, Users } from "lucide-react";


export const SECTIONS = [
    {
        title: null,
        items: [
            { label: "sideBar.DashBoard", icon: LayoutDashboard, path: "/Dashboard" },
            { label: 'sideBar.booking', icon: BedDouble,path:"/Dashboard/booking" },
            {
                label: "sideBar.facility",
                icon: Building2,
                children: [
                    { label: "sideBar.room", path: "/Dashboard/facility/room" },
                    { label: "sideBar.asset", path: "/Dashboard/facility/asset" },
                    { label: "sideBar.extra", path: "/Dashboard/facility/service" },
                    { label: "sideBar.category", path: "/Dashboard/facility/category" },
                ],
            },
            { label: 'sideBar.user', icon: Users },
            { label: 'sideBar.staff', icon: UserCog, path: "/Dashboard/staff" },
            {
                label: "sideBar.post",
                icon: NotebookPen,
                children: [
                    { label: "sideBar.blog", path: "/Dashboard/post/blog" },
                    { label: "sideBar.banner", path: "/Dashboard/post/banner" },
                ],
            },
            { label: "sideBar.reportings", icon: FileText },
        ],
    },
    {
        title: null,
        items: [
            { label: "sideBar.logout", icon: LogOut, action: "LOGOUT", },
        ]
    }
]