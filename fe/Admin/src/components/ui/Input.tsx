const Input = ({ label,
  type = "text",
  className = "",
  disabled = false,
  ...props}: any) => (
  <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          className={`mb-1 font-medium ${
            disabled ? "text-gray-400" : "text-[#253150]"
          }`}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        disabled={disabled}
        {...props}
        className={`
          w-full rounded-lg p-2 outline-none border
          ${
            disabled
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white text-gray-800 border-[#4B62A0] focus:border-[#3E5286]"
          }
        `}
      />
    </div>
);
export default Input;