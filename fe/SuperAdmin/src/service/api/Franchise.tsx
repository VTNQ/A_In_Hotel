import Http from "../http/http";

export const createOrUpdateFranchise = async (data: any) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (data.image) {
      formData.append("image", data.image);
    }
    return await Http.post("/api/franchises", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error(error);
  }
};
export const getFranchise = async ()=>{
    return await Http.get("/api/franchises");

}