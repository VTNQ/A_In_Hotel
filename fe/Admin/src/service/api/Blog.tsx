import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { BlogForm, BlogResponse } from "../../type/blog.types";
import Http from "../http/http";

export const createBlog = async (blogData: BlogForm) => {
    const formData = new FormData();
    Object.entries(blogData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (blogData.image) {
        formData.append("image", blogData.image);
    }

    return await Http.post<ApiResponse<void>>("/api/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

}
export const getAllBlog = async (options: GetAllOptions) => {
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get<ApiResponse<PageResponse<BlogResponse>>>("/api/blogs", {
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const findById = async (id: number) => {
    return await Http.get<ApiResponse<BlogResponse>>(`/api/blogs/${id}`);
}
export const updateBlog = async (id: number, blogData: BlogForm) => {
    const formData = new FormData();
    Object.entries(blogData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (blogData.image) {
        formData.append("image", blogData.image);
    }

    return await Http.put<ApiResponse<void>>(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
export const updateStatus = async (id: number, status: number) => {
    return await Http.patch<ApiResponse<void>>(`/api/blogs/${id}/status?status=${status}`);

}