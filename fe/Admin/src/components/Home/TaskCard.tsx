import { Plus } from "lucide-react";

const tasks = [
  {
    title: "Confirm Group Booking for VIP Guests",
    date: "Feb 14, 2026",
  },
  {
    title: "Update Room Maintenance Schedule",
    date: "Feb 14, 2026",
  },
  {
    title: "Review Monthly Revenue Report",
    date: "Feb 14, 2026",
  },
  {
    title: "Coordinate Staff Shift Assignments",
    date: "Feb 14, 2026",
  },
];

const TasksCard = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100
    dark:border-slate-700 h-full transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#1F2937] dark:text-gray-100">
          Tasks
        </h3>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 
        dark:border-slate-700
        hover:bg-gray-100 dark:hover:bg-slate-800 transition">
          <Plus size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-gray-100
            dark:border-slate-800
            last:border-none"
          >
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 accent-[#32416B] dark:accent-blue-400"
            />

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {task.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {task.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksCard;