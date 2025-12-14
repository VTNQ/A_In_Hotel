import { createContext, useContext, useEffect, useState } from "react";
import type { BookingSearch, BookingSearchContextValue } from "../../type/booking.types";

const BookingSearchContext =
  createContext<BookingSearchContextValue | null>(null);

export const BookingSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearchState] = useState<BookingSearch | null>(null);

  // 🔥 INIT từ localStorage (reload vẫn còn)
  useEffect(() => {
    const saved = localStorage.getItem("booking_search");
    if (saved) {
      setSearchState(JSON.parse(saved));
    }
  }, []);

  const setSearch = (s: BookingSearch) => {
    setSearchState(s);
    localStorage.setItem("booking_search", JSON.stringify(s)); // 🔥 persist
  };

  return (
    <BookingSearchContext.Provider value={{ search, setSearch }}>
      {children}
    </BookingSearchContext.Provider>
  );
};

export const useBookingSearch = () => {
    const ctx = useContext(BookingSearchContext);
    if (!ctx) {
      throw new Error("useBookingSearch must be used inside BookingSearchProvider");
    }
    return ctx;
  };