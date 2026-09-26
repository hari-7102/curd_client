import axios from 'axios';

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
});



// ✅ Request interceptor → always read the latest token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // get fresh token each time
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.post('/refresh', {}, { withCredentials: true });
        const newAccessToken = res.data.accesstoken;
        console.log("newAccessToken:", newAccessToken);

        if (newAccessToken) {
          localStorage.setItem('authToken', newAccessToken);
          // set header for retry
          originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return apiClient({ ...originalRequest });

        }
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('authToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;