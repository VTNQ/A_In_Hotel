import Http from "../http/http";

export const login = async (username: string, password: string) => {
  const response = await Http.post(
    '/api/account/login',
    { username, password },
    { skipAuth: true, withCredentials: true }
  );
  return response.data;
}