import type { GetAllOptions } from "../../type/common";
import Http from "../http/http";

export const createBooking = async (data: any) => {
  const res = await Http.post("/api/bookings", data, {
    skipAuth: true,
    withCredentials: true,
  });
  return res.data;
};

export const getBookings = async (options: GetAllOptions) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
    mine = false,
  } = options;
  const resp = await Http.get("/api/bookings", {
    params: {
      page,
      size,
      sort,
      filter,
      searchField,
      searchValue,
      all,
      mine,
    },
    skipAuth: true,
    withCredentials: true,
  });
  return resp.data;
};
export const getBookingById = async (id: number) => {
  return await Http.get(`/api/bookings/${id}`, {
    skipAuth: true,
    withCredentials: true,
  });
};
export const cancelBook = async (id: number) => {
  return await Http.patch(`/api/bookings/${id}/cancel`, {
  });
};