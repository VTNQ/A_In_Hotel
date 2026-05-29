const TextArea = ({
  label,
  placeholder = "Enter text",
  ...props
}: any) => (
  <div className="mt-4">

    {/* LABEL */}
    <label className="text-sm text-[#253150] dark:text-gray-200 mb-1 block">
      {label}
    </label>

    {/* TEXTAREA */}
    <textarea
      {...props}
      placeholder={placeholder}
      rows={3}
      className="
        w-full border border-[#4B62A0]
        focus:border-[#3E5286]
        bg-[#EEF0F7]
        rounded-lg p-2 outline-none transition

        dark:bg-gray-900
        dark:text-gray-100
        dark:border-gray-600
        dark:focus:border-blue-500
      "
    />
  </div>
);

export default TextArea;