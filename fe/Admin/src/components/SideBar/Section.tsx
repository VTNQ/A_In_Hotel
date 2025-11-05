import { BedDouble, Building2, FileText, Globe, HelpCircle, LayoutDashboard, LogOut, Settings, UserCog, Users } from "lucide-react";

export const SECTIONS = [
    {
        title: null,
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/Dashboard" },
            { label: 'Booking Management', icon: BedDouble },
            {
                label: "Facility Management",
                icon: Building2,
                children: [
                  { label: "Room Management",path:"/Dashboard/facility/rooms" },
                  { label: "Amenities & Asset Tracking", path: "/Dashboard/facility/assets" },
                  { label: "Extra Services", path: "/Dashboard/facility/services" },
                  { label: "Category Management",path:"/Dashboard/facility/categories" },
                ],
            },
            { label: 'User Management', icon: Users },
            { label: 'Staff Management', icon: UserCog },
            { label: 'Website Post', icon: Globe },
            { label: "Reportings", icon: FileText },
        ],
    },
    {
        title: null,
        items: [
            { label: "Help & support", icon: HelpCircle },
            { label: "Setting", icon: Settings },
            { label: "log out", icon: LogOut },
        ]
    }
]