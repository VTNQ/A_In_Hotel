const TabButton = ({ icon, label, active, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-5 text-sm font-bold border-b-2 transition-all ${
        active
          ? "border-[#42578E] text-[#42578E]"
          : "border-transparent text-slate-400 hover:text-[#42578E]"
      }`}
    >
        {icon}
        {label}
    </button>
  );
};
export default TabButton;