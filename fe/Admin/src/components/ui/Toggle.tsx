import type { ToggleProps } from "../../type";

const Toggle = ({ label, description, checked, onChange }: ToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-[#253150] dark:text-gray-100">
          {label}
        </p>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors
          ${
            checked
              ? "bg-[#2E3A8C] dark:bg-indigo-500"
              : "bg-gray-300 dark:bg-gray-600"
          }
        `}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-100 rounded-full transition-transform
            ${checked ? "translate-x-5" : ""}
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;