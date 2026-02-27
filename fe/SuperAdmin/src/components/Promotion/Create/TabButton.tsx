const TabButton = ({ icon, label, active, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 py-5 text-sm font-bold border-b-2 transition-all 
        whitespace-nowrap
            ${
              active
                ? "border-[#3B5CCC] text-[#3B5CCC]"
                : "border-transparent text-slate-500 hover:text-[#3B5CCC]"
            }`}
    >
      {icon}
      {label}
    </button>
  );
};
export default TabButton;