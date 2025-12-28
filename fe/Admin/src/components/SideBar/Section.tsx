import { BedDouble, Building2, FileText, HelpCircle, LayoutDashboard, LogOut, NotebookPen, Settings, UserCog, Users } from "lucide-react";
import { clearTokens } from "../../util/auth";

export const SECTIONS = [
    {
        title: null,
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/Dashboard" },
            { label: 'Booking Management', icon: BedDouble,path:"/Dashboard/booking" },
            {
                label: "Facility Management",
                icon: Building2,
                children: [
                    { label: "Room Management", path: "/Dashboard/facility/room" },
                    { label: "Amenities & Asset Tracking", path: "/Dashboard/facility/asset" },
                    { label: "Extra Services", path: "/Dashboard/facility/service" },
                    { label: "Category Management", path: "/Dashboard/facility/category" },
                ],
            },
            { label: 'User Management', icon: Users },
            { label: 'Staff Management', icon: UserCog, path: "/Dashboard/staff" },
            {
                label: "Post Management",
                icon: NotebookPen,
                children: [
                    { label: "Blog post", path: "/Dashboard/post/blog" },
                    { label: "Banner post", path: "/Dashboard/post/banner" },
                ],
            },
            { label: "Reportings", icon: FileText },
        ],
    },
    {
        title: null,
        items: [
            { label: "Help & support", icon: HelpCircle },
            { label: "Setting", icon: Settings },
            { label: "log out", icon: LogOut,onClick:()=>{
                clearTokens();
                window.location.href="/";
            } },
        ]
    }
]