import { useEffect } from "react";
import { PACKAGE_TIME_MAP } from "../../../type/booking.types";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const PACKAGE_OPTIONS = [
    { label: "Overnight", value: "2" },
    { label: "Day Use", value: "1" },
    { label: "Full Day", value: "3" }
];

const BookingDetailsPanel = ({ form, nights, onChange }: any) => {
    const isAutoTimePackage =
        form.package === "2" || form.package === "3";

    // 🔹 AUTO SET TIME THEO PACKAGE
    useEffect(() => {
        if (PACKAGE_TIME_MAP[form.package]) {
            const time = PACKAGE_TIME_MAP[form.package];
            onChange("checkInTime", time.checkIn);
            onChange("checkOutTime", time.checkOut);
        }
    }, [form.package, onChange]);

    // 🔹 AUTO SET PACKAGE = FULL DAY KHI nights >= 1
    useEffect(() => {
        if (!form.checkInDate || !form.checkOutDate) return;

        if (nights >= 1 && form.package !== "3") {
            onChange("package", "3"); // ✅ ĐÚNG
        }
    }, [nights, form.checkInDate, form.checkOutDate, form.package, onChange]);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800">
                Booking Details
            </h3>

            <Input label="Check-in Date" value={form.checkInDate} readOnly />

            <Input
                label="Check-in Time"
                type="time"
                value={form.checkInTime}
                disabled={isAutoTimePackage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange("checkInTime", e.target.value)
                }
            />

            <Input label="Check-out Date" value={form.checkOutDate} readOnly />

            <Input
                label="Check-out Time"
                type="time"
                value={form.checkOutTime}
                disabled={isAutoTimePackage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange("checkOutTime", e.target.value)
                }
            />

            <Select
                label="Booking Package"
                value={form.package}
                options={PACKAGE_OPTIONS.filter((opt) => {
                    if (opt.value === "2" && nights <= 1) return false; // hide Overnight
                    return true;
                })}
                onChange={(v) => onChange("package", v)}
            />

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Adults"
                    type="number"
                    min={1}
                    value={form.adults}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange("adults", Number(e.target.value))
                    }
                />

                <Input
                    label="Children"
                    type="number"
                    min={0}
                    value={form.children}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange("children", Number(e.target.value))
                    }
                />
            </div>

            <div className="border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">
                        {nights} {nights > 1 ? "nights" : "night"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsPanel;
