import Http from "../http/http"

export const getSystemContentByKey = async (key:number)=>{
    return await Http.get(`/api/system-content/${key}`,{
        skipAuth:true
    })
}

export const updateSystemContent =async(id:number,data:any)=>{
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (data.image) {
        formData.append("image", data.image);
    }
    return await Http.put(`/api/system-content/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}