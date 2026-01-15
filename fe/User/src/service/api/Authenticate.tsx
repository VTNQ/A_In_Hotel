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