import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Home,
  MoreHorizontal,
} from "lucide-react";
import type { ActivityItem } from "../../type/Statistics.types";

const activities: ActivityItem[] = [
  {
    id: 1,
    title: "House keeping Team",
    description: "Marked Room 305 as clean & Ready",
    time: "09:20 AM",
    type: "housekeeping",
  },
  {
    id: 2,
    title: "Manager approved",
    description: "Checked in Emily Carter to Room 210 (Deluxe Suite)",
    time: "08:50 AM",
    type: "manager",
  },
  {
    id: 3,
    title: "Reservation Staff",
    description:
      "Confirmed corporate booking for TechVision Ltd., 5 rooms reserved",
    time: "08:30 AM",
    type: "reservation",
  },
  {
    id: 4,
    title: "System Update - Revenue report",
    description: "For Feb 2026 successfully generated and saved",
    time: "08:00 AM",
    type: "system",
  },
];

const iconMap = {
  housekeeping: {
    icon: Home,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  manager: {
    icon: CheckCircle,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  reservation: {
    icon: FileText,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  system: {
    icon: AlertCircle,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
};
const RecentActivities = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Activities
        </h3>
        <MoreHorizontal className="text-gray-400 cursor-pointer" size={18} />
      </div>
      <div className="space-y-6">
{activities.map((item, index) => {
          const Icon = iconMap[item.type].icon;
          return (
            <div key={item.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <span className="absolute left-4 top-10 w-[2px] h-full bg-gray-200" />
              )}

              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${iconMap[item.type].bg}`}
              >
                <Icon
                  size={16}
                  className={iconMap[item.type].color}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock size={12} />
                  {item.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RecentActivities;
