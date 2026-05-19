import{ forwardRef } from "react";
import type { InputProps } from "../../type";


const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      className = "",
      disabled = false,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label
            className={`mb-1 font-medium ${
              disabled
                ? "text-gray-400"
                : error
                ? "text-red-500"
                : "text-[#253150]"
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
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                : error
                ? "border-red-500 focus:border-red-500"
                : "bg-white text-gray-800 border-[#4B62A0] focus:border-[#3E5286]"
            }
          `}
        />

        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;