import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getPromotionAll = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/promotions", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return res.data;
};
export const createPromotion = async (promotionData: any) => {
  return await Http.post("/api/promotions/create", promotionData);
};
export const getPromotionById = async (promotionId: number) => {
  return await Http.get(`/api/promotions/${promotionId}`);
};
export const updatePromotion = async (
  promotionId: number,
  promotionData: any,
) => {
  return await Http.put(`/api/promotions/${promotionId}`, promotionData);
};

export const updateStatusPromotion = async (
  promotionId: number,
  isActive: any,
) => {
  return await Http.patch(
    `/api/promotions/${promotionId}/status?status=${isActive}`,
  );
};
