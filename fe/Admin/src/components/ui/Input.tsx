const Input = ({ label, type = "text",error, className = "", ...props }: any) => (
  <div className={`flex flex-col ${className}`}>
    <label className="block mb-1 font-medium text-[#253150]">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
    />
      {error && (
      <span className="mt-1 text-xs text-red-500">
        {error}
      </span>
    )}
  </div>
);
export default Input;