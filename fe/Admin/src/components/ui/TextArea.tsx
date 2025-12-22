const TextArea = ({ label, placeholder = "Enter text", ...props }: any) => (
  <div className="mt-4">
    <label className="text-sm text-[#253150] mb-1 block">
      {label}
    </label>
    <textarea
      {...props}
      placeholder={placeholder}
      rows={3}
      className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
    />
  </div>
);

export default TextArea;
