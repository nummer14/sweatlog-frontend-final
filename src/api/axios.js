import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: 모든 요청 헤더에 Access Token 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = authStore;

      if (!refreshToken) {
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post("/api/auth/refresh", { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data;
        
        authStore.setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken, user });
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;