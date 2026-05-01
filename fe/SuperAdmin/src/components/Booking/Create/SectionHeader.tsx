import type { SectionHeaderProps } from "../../../type/booking.types";

const SectionHeader = ({ title, icon }: SectionHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-4 sm:mb-5 min-w-0">
      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9
      rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
        {title}
      </h3>
    </div>
  );
};

export default SectionHeader;
