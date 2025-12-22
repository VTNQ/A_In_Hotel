import { useEffect, useState } from "react";
import type { Booking } from "../type/booking.types";

const STORAGE_KEY = "bookingDraft_v1";
const EXPIRE_TIME = 30 * 60 * 1000; // 30 phút

type BookingWithTime = Booking & {
  updatedAt: number;
};

const DEFAULT: BookingWithTime = {
  step: 1,
  guest: {},
  selectDate: {},
  rooms: [],
  payment: {},
  updatedAt: Date.now(),
};

const useBooking = () => {
  const [booking, setBooking] = useState<BookingWithTime>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT;

    try {
      const parsed: BookingWithTime = JSON.parse(saved);

      if (Date.now() - parsed.updatedAt > EXPIRE_TIME) {
        localStorage.removeItem(STORAGE_KEY);
        return DEFAULT;
      }

      return parsed;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    const data: BookingWithTime = {
      ...booking,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [booking]);

  const updateBooking = (data: Partial<Booking>) => {
    setBooking((prev) => ({
      ...prev,
      ...data,
      updatedAt: Date.now(),
    }));
  };

  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBooking(DEFAULT);
  };

  return { booking, updateBooking, clearBooking };
};

export default useBooking;
