import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { PromotionForm, PromotionResponse } from "../../type/promotion.types";
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
  const res = await Http.get<ApiResponse<PageResponse<PromotionResponse>>>("/api/promotions", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return res.data;
};
export const createPromotion = async (promotionData: PromotionForm) => {
  return await Http.post<ApiResponse<void>>("/api/promotions/create", promotionData);
};
export const getPromotionById = async (promotionId: number) => {
  return await Http.get<ApiResponse<PromotionResponse>>(`/api/promotions/${promotionId}`);
};
export const updatePromotion = async (
  promotionId: number,
  promotionData: any,
) => {
  return await Http.put<ApiResponse<void>>(`/api/promotions/${promotionId}`, promotionData);
};

export const updateStatusPromotion = async (
  promotionId: number,
  isActive: any,
) => {
  return await Http.patch<ApiResponse<void>>(
    `/api/promotions/${promotionId}/status?status=${isActive}`,
  );
};
