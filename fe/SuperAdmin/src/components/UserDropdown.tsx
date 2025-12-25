import { useEffect, useRef, useState } from "react";
import { User, Settings, Info, LogOut } from "lucide-react";

type Props = {
    name: string;
    email: string;
    avatarUrl: string;
    onLogout: () => void;
    onProfile?: () => void;
    onSettings?: () => void;
};

export default function UserDropdown({
    name,
    email,
    avatarUrl,
    onLogout,
    onProfile,
    onSettings,
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // click outside để đóng
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Avatar */}
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none"
            >
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden text-sm font-medium text-gray-700 dark:text-neutral-200 sm:block">
                    {name}
                </span>
                <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""
                        }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50
                        dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Header */}
                    <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                            {name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                            {email}
                        </p>
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800" />

                    {/* Menu */}
                    <ul className="py-1">
                        <Item icon={User} label="Edit profile" onClick={onProfile} />
                        <Item icon={Settings} label="Account settings" onClick={onSettings} />
                        <Item icon={Info} label="Support" />
                    </ul>

                    <div className="border-t border-gray-100 dark:border-neutral-800" />

                    <ul className="py-1">
                        <Item
                            icon={LogOut}
                            label="Sign out"
                            danger
                            onClick={onLogout}
                        />
                    </ul>
                </div>
            )}
        </div>
    );
}

function Item({
    icon: Icon,
    label,
    onClick,
    danger = false,
}: {
    icon: any;
    label: string;
    onClick?: () => void;
    danger?: boolean;
}) {
    return (
        <li>
            <button
                onClick={onClick}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition
          ${danger
                        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        : "text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    }`}
            >
                <Icon className="h-4 w-4" />
                {label}
            </button>
        </li>
    );
}
