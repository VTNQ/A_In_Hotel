import { useEffect, useState } from "react";
import type { Booking } from "../type/booking.types";

const STORAGE_KEY = "bookingDraft_v1";
const EXPIRE_TIME = 30 * 60 * 1000;

const TOTAL_SECONDS = 15 * 60;

const createDefaultBooking = (): Booking => {
  const now = Date.now();

  return {
    step: 1,
    guest: {},
    selectDate: {},
    services: [],
    payment: {},
    countdown: {
      totalSeconds: TOTAL_SECONDS,
      startedAt: now,
      expiredAt: now + TOTAL_SECONDS * 1000,
    },
  };
};

const useBooking = () => {
  const [booking, setBooking] = useState<Booking>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return createDefaultBooking();

    try {
      const parsed: Booking = JSON.parse(saved);

      const isExpired =
        !parsed?.countdown?.expiredAt ||
        Date.now() - (parsed as any).updatedAt > EXPIRE_TIME;

      if (isExpired) {
        localStorage.removeItem(STORAGE_KEY);
        return createDefaultBooking();
      }

      // FIX countdown missing / invalid
      const now = Date.now();
      const expiredAt = Number(parsed?.countdown?.expiredAt);

      parsed.countdown = {
        totalSeconds: TOTAL_SECONDS,
        startedAt: parsed?.countdown?.startedAt || now,
        expiredAt: Number.isFinite(expiredAt)
          ? expiredAt
          : now + TOTAL_SECONDS * 1000,
      };

      return parsed;
    } catch {
      return createDefaultBooking();
    }
  });

  // save localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...booking,
        updatedAt: Date.now(),
      }),
    );
  }, [booking]);

  // update booking
  const updateBooking = (data: Partial<Booking>) => {
    setBooking((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // clear
  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBooking(createDefaultBooking());
  };

  return {
    booking,
    updateBooking,
    clearBooking,
  };
};

export default useBooking;