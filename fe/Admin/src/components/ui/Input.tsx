import { forwardRef } from "react";
import type { InputProps } from "../../type";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, type = "text", className = "", disabled = false, error, ...props },
    ref,
  ) => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label
            className={`mb-1 font-medium ${
               disabled
                ? "text-gray-400 dark:text-gray-600"
                : error
                ? "text-red-500 dark:text-red-400"
                : "text-[#253150] dark:text-gray-200"
            }`}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          {...props}
          className={`
            w-full rounded-lg p-2 outline-none border transition-all
            ${
              disabled
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                : error
                  ? "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400"
                  : "bg-white text-gray-800 border-[#4B62A0] focus:border-[#3E5286] dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 dark:focus:border-blue-500"
            }
          `}
        />

        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
