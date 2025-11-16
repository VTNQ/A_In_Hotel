import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const createBlog = async (blogData: any) => {
    const formData = new FormData();
    Object.entries(blogData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (blogData.image) {
        formData.append("image", blogData.image);
    }

    return await Http.post("/api/blogs", formData, {
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
    const resp = await Http.get("/api/blogs", {
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const findById = async (id: number) => {
    return await Http.get(`/api/blogs/${id}`);
}
export const updateBlog = async (id: number, blogData: any) => {
    const formData = new FormData();
    Object.entries(blogData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (blogData.image) {
        formData.append("image", blogData.image);
    }

    return await Http.put(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
export const updateStatus = async (id: number, status: number) => {
    return await Http.patch(`/api/blogs/${id}/status?status=${status}`);

}