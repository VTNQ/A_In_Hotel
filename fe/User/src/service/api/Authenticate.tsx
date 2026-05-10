import Http from "../http/http";

export const login = async (username: string, password: string) => {
  const response = await Http.post(
    '/api/account/login',
    { username, password },
    { skipAuth: true, withCredentials: true }
  );
  return response.data;
}

export const register = async (data:any)=>{
  const response = await Http.post(
    "/api/account/register/user",
    data,
    { skipAuth: true, withCredentials: true }
  );
  return response.data;
}

export const getProfile = async () => {
  const response = await Http.get("/api/account/user/profile");
  return response.data;
};  
export const updateProfile = async (data:any)=>{
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "image" && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  if (data.image) {
    formData.append("image", data.image);
  }
  return await Http.patch("/api/customers/me", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}