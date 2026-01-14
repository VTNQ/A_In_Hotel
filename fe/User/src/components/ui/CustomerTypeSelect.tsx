import type { CustomerTypeSelectProps } from "../../type/common";

export default function CustomerTypeSelect({
    value,
    onChange,
    options,
}: CustomerTypeSelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
        >
            <option value="">Select customer type</option>

            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}