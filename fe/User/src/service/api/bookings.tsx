import Http from "../http/http";

export const createBooking = async (data: any) => {
  const res = await Http.post("/api/bookings", data, {
    skipAuth: true,
    withCredentials: true,
  });
  return res.data;
};
