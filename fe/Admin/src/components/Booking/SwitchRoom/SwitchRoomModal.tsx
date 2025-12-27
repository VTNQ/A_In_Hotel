import React, { useEffect, useMemo, useState } from "react";
import type { SwitchRoomModalProps } from "../../../type/booking.types";
import type { Room } from "../../../type/room.types";
import { CheckCircle, X } from "lucide-react";
import SelectV2 from "../../ui/SelectV2";
import { getAllRoom } from "../../../service/api/Room";
import { findByIdAndDetailsActiveTrue, handleSwitchRoom } from "../../../service/api/Booking";
import Input from "../../ui/Input";
import { useAlert } from "../../alert-context";
import { getTokens } from "../../../util/auth";

const SwitchRoomModal = ({
    open,
    onClose,
    onConfirm,
    id
}: SwitchRoomModalProps) => {
    const [selected, setSelected] = useState<Record<number, Room | null>>({});
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const { showAlert } = useAlert();
    const usedRoomIds = useMemo(
        () =>
            Object.values(selected)
                .filter((v): v is Room => v !== null)
                .map(v => v.id),
        [selected]
    );

    const fetchBooking = async () => {
        const resp = await findByIdAndDetailsActiveTrue(id);
        setBooking(resp.data.data);
    }
    const fetchRoom = async () => {
        const filterParts = [
            "status==3",
            `hotelId==${getTokens()?.hotelId}`
        ];
        if (usedRoomIds.length > 0) {
            filterParts.push(`id=out=(${usedRoomIds.join(",")})`);
        }
        const res = await getAllRoom({
            all: true,
            filter: filterParts.join(";")
        })
        setAvailableRooms(res.data?.content || []);
    }
    useEffect(() => {
        if (!open || !id) return;

        const init = async () => {
            setLoading(true);
            try {
                await fetchBooking();
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [open, id]);
    useEffect(() => {
        if (!open) return;
        fetchRoom();
    }, [open])
    const getRoomPriceByPackage = (room: any, bookingPackage: number) => {
        switch (bookingPackage) {
            case 1: // FIRST_2_HOURS
                return room.basePrice ?? 0;
            case 2: // OVERNIGHT
                return room.overnightPrice ?? 0;
            case 3: // FULL_DAY
                return room.defaultRate ?? 0;
            default:
                return room.defaultRate ?? 0;
        }
    };

    /* ===== SUMMARY LOGIC ===== */
    const summary = useMemo(() => {
        if (!booking || !Array.isArray(booking.details)) {
            return { rows: [], total: 0 };
        }

        let total = 0;
        const bookingPackage = booking.bookingPackage;

        const rows = booking.details
            .filter((d: any) => d.roomId !== null)
            .map((d: any) => {
                const newRoom = selected[d.id];
                const reason = reasons[d.id];
                // Giá phòng cũ (theo package)
                const oldPrice = d.price;

                if (!newRoom) {
                    return {
                        id: d.id,
                        from: d.roomNumber,
                        selected: false,
                    };
                }

                // Giá phòng mới theo package
                const newPrice = getRoomPriceByPackage(newRoom, bookingPackage);

                const rawDiff = newPrice - oldPrice;
                const diff = Math.max(0, rawDiff);
                total += diff;
                return {
                    id: d.id,
                    from: d.roomNumber,
                    to: newRoom.roomNumber,
                    toType: newRoom.roomTypeName,
                    diff,
                    reason,
                    selected: true,
                };
            });

        return { rows, total };
    }, [selected, reasons, booking]);



    /* ===== CONFIRM HANDLER ===== */
    const handleConfirm = async () => {
        if (confirming) return;
        try {
            setConfirming(true);
            const items = Object.entries(selected)
                .filter(([detailId, room]) => room && reasons[Number(detailId)])
                .map(([detailId, room]) => ({
                    bookingDetailId: Number(detailId),
                    newRoomId: room!.id,
                    reason: reasons[Number(detailId)], // ✅ TRUYỀN REASON
                }));

            const payload = { items };
            const response = await handleSwitchRoom(Number(id), payload);

            showAlert({
                title:
                    response?.data?.message || "switch-room successful!",
                type: "success",
                autoClose: 3000,
            });
            onConfirm();
            onClose()
        } catch (err: any) {
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to confirm switch-room. Please try again.",
                type: "error",
            });
        } finally {
            setConfirming(false);
        }
    };
    const roomOptions = useMemo(
        () =>
            availableRooms.map(r => ({
                value: r.id,
                label: `[${r.roomNumber}] - ${r.roomTypeName}`,
            })),
        [availableRooms]
    );
    const resetState = () => {
        setSelected({});
        setReasons({});
        setAvailableRooms([]);
        setBooking(null);
        setLoading(false);
        setConfirming(false);
    };

    if (!open) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 
        ${loading ? "scale-100 opacity-70" : "scale-100 opacity-100"}`}>
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold">Switch Room</h1>
                        <p className="text-sm text-gray-500">
                            Manage room changes and verify details.
                        </p>
                    </div>
                    <button onClick={() => {
                        resetState();
                        onClose();
                    }} className="p-2 rounded hover:bg-gray-100">
                        <X />
                    </button>
                </div>
                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
                        <p className="mt-4 text-sm text-[#5f6b85]">
                            Loading booking details...
                        </p>
                    </div>
                )}
                {!loading && booking && (
                    <>
                        {/* ================= BODY ================= */}
                        <div className="flex-1 overflow-y-auto custom-scroll p-8 space-y-8 bg-gray-50">

                            {/* ===== CURRENT BOOKING ===== */}
                            <div>
                                <h2 className="font-semibold mb-4">Current Booking</h2>

                                <div className="bg-white rounded-xl border border-gray-200">
                                    {/* ===== HEADER ===== */}
                                    <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-500 bg-gray-50">
                                        <div className="col-span-2">Room</div>
                                        <div className="col-span-2">Type</div>
                                        <div className="col-span-2">Rate</div>
                                        <div className="col-span-4">New Room Selection</div>
                                        <div className="col-span-2">Reason</div>
                                    </div>

                                    {/* ===== BODY ===== */}
                                    {booking?.details
                                        .filter((d: any) => d.roomId !== null)
                                        .map((d: any) => (
                                            <div
                                                key={d.id}
                                                className="grid grid-cols-12 items-center px-6 py-4 border-t border-gray-200"
                                            >
                                                <div className="col-span-2 font-bold">
                                                    {d.roomNumber}
                                                </div>

                                                <div className="col-span-2">
                                                    {d.roomType}
                                                </div>

                                                <div className="col-span-2 text-gray-500">
                                                    {d.price.toLocaleString()} ₫
                                                </div>

                                                {/* ✅ New Room Selection (4 cols) */}
                                                <div className="col-span-3">
                                                    <div className="max-w-[170px]">  {/* 👈 thu lại */}
                                                        <SelectV2
                                                            value={selected[d.id]?.id}
                                                            options={roomOptions}
                                                            placeholder="Select room..."
                                                            onChange={(roomId) => {
                                                                const room =
                                                                    availableRooms.find(r => r.id === roomId) || null;

                                                                setSelected(prev => ({
                                                                    ...prev,
                                                                    [d.id]: room,
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>


                                                {/* ✅ Reason input (2 cols) */}
                                                <div className="col-span-3">
                                                    <Input
                                                        type="text"
                                                        placeholder="Reason for switch"
                                                        value={reasons[d.id] || ""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = e.target.value;
                                                            setReasons(prev => ({
                                                                ...prev,
                                                                [d.id]: value,
                                                            }));
                                                        }}
                                                        disabled={!selected[d.id]}

                                                    />


                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>


                            {/* ===== SUMMARY & CONFIRM ===== */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
                                <div className="grid grid-cols-2 divide-x divide-gray-200">

                                    {/* ===== CONFIRM SELECTION ===== */}
                                    <div className="p-6">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            Confirm Selection
                                        </h3>

                                        <div className="space-y-3">
                                            {summary.rows.length === 0 ? (
                                                <p className="text-sm text-gray-400">No room selected</p>

                                            ) : (
                                                summary.rows.map((r: any) => (
                                                    <label
                                                        key={r.id}
                                                        className={`flex items-start gap-3 p-2 rounded-lg
                                                            ${r.selected
                                                                ? "hover:bg-gray-50"
                                                                : "opacity-50 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={r.selected}
                                                            disabled
                                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600"
                                                        />

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">
                                                                Room {r.from}
                                                            </span>

                                                            {r.selected ? (
                                                                <>
                                                                    <span className="text-xs text-gray-500">
                                                                        → <span className="font-semibold">{r.to}</span> ({r.toType})
                                                                    </span>

                                                                    <span className="text-xs italic text-gray-400">
                                                                        Reason: {r.reason || "—"}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">
                                                                    No change selected
                                                                </span>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))
                                            )}

                                        </div>
                                    </div>

                                    {/* ===== PRICE IMPACT ===== */}
                                    <div className="p-6 bg-gray-50/50">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            Price Impact
                                        </h3>

                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                                            {summary.rows
                                                .filter((r: any) => r.selected)
                                                .map((r: any) => (
                                                    <div
                                                        key={r.bookingDetailId}
                                                        className="flex justify-between text-sm text-gray-700"
                                                    >
                                                        <span>
                                                            {r.from} → {r.to}
                                                        </span>
                                                        <span
                                                            className={
                                                                r.diff! > 0
                                                                    ? "font-semibold text-red-600"
                                                                    : "text-gray-500"
                                                            }
                                                        >
                                                            {r.diff! > 0
                                                                ? `+${r.diff!.toLocaleString()} ₫/night`
                                                                : "No change"}
                                                        </span>
                                                    </div>
                                                ))}

                                            <div className="pt-3 mt-3 border-t border-blue-200 flex justify-between items-center">
                                                <span className="text-xs font-bold text-blue-800 uppercase">
                                                    Total Difference
                                                </span>
                                                <span className="text-sm font-bold text-blue-800">
                                                    +{summary.total.toLocaleString()} ₫
                                                </span>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className="px-8 py-5 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl bg-[#EEF0F7] text-[#2E3A8C] hover:bg-[#e2e6f3]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition ${confirming
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#42578E] text-white hover:bg-[#364a7d]"
                                    }`}
                                disabled={summary.rows.every((r: any) => !r.selected)}
                            >
                                <CheckCircle size={18} />
                                {confirming ? "Processing..." : "Confirm Switch"}

                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default SwitchRoomModal;