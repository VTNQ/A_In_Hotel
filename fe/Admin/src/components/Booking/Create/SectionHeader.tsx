import type { SectionHeaderProps } from "../../../type/booking.types";

const SectionHeader = ({ title, icon }: SectionHeaderProps) => {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-gray-800">
                {title}
            </h3>
        </div>
    )
}
export default SectionHeader;