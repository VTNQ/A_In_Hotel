import { createContext, useContext, useState } from "react";
import type { BookingSearch, BookingSearchContextValue } from "../../type/booking.types";

const BookingSearchContext =
  createContext<BookingSearchContextValue | null>(null);

export const BookingSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // 🔥 INIT NGAY LÚC KHỞI TẠO
  const [search, setSearchState] = useState<BookingSearch | null>(() => {
    try {
      const saved = localStorage.getItem("booking_search");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setSearch = (s: BookingSearch) => {
    setSearchState(s);
    localStorage.setItem("booking_search", JSON.stringify(s));
  };
 const clearSearch = () => {
    setSearchState(null);
    localStorage.removeItem("booking_search");
  };
  return (
    <BookingSearchContext.Provider value={{ search, setSearch,clearSearch }}>
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
