const TabButton = ({ icon, label, active, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 py-5 text-sm font-bold border-b-2 transition-all
        ${
          active
            ? "border-[#42578E] text-[#42578E] dark:border-blue-500 dark:text-blue-400"
            : "border-transparent text-slate-400 dark:text-gray-500 hover:text-[#42578E] dark:hover:text-blue-400"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;