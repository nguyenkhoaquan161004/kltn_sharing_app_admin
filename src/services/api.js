import axios from "axios";

// API URL
const API_BASE_URL = "https://api.shareo.studio";

console.log("API_BASE_URL:", API_BASE_URL, "MODE:", import.meta.env.MODE);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Response interceptor with auto refresh logic
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying, attempt to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("admin_refresh_token");

            if (!refreshToken) {
                // No refresh token, logout user
                localStorage.removeItem("admin_access_token");
                localStorage.removeItem("admin_refresh_token");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const response = await apiClient.post("/api/public/v2/auth/refresh-token", {
                        refreshToken: refreshToken,
                    });

                    const newAccessToken = response.data.data?.access_token;
                    const newRefreshToken = response.data.data?.refresh_token;

                    if (newAccessToken) {
                        localStorage.setItem("admin_access_token", newAccessToken);
                        if (newRefreshToken) {
                            localStorage.setItem("admin_refresh_token", newRefreshToken);
                        }

                        // Update original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        isRefreshing = false;
                        onRefreshed(newAccessToken);

                        // Retry original request
                        return apiClient(originalRequest);
                    } else {
                        throw new Error("No access token in refresh response");
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    isRefreshing = false;
                    localStorage.removeItem("admin_access_token");
                    localStorage.removeItem("admin_refresh_token");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            } else {
                // If already refreshing, queue this request
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);

export const adminApi = {
    // Auth
    login: (email, password) =>
        apiClient.post("/api/public/v2/auth/login", {
            usernameOrEmail: email,
            password,
            rememberMe: false
        }),

    refreshToken: (refreshToken) =>
        apiClient.post("/api/public/v2/auth/refresh-token", {
            refreshToken,
        }),

    // Users
    getAllUsers: (page = 1, size = 10) =>
        apiClient.get("/api/v2/users", { params: { page, size } }),
    deleteUser: (userId) => apiClient.delete(`/api/v2/users/${userId}`),
    addPoints: (userId, points, reason, sourceType = "ADMIN", referenceId = "") =>
        apiClient.post("/api/v2/gamification/points/add", {
            userId,
            points,
            reason,
            sourceType,
            referenceId,
        }),
    sendNotification: (userId, title, message) =>
        apiClient.post("/api/v2/notifications/send", {
            userId,
            title,
            body: message,
            type: "SYSTEM"
        }),

    // Categories
    getAllCategories: () => apiClient.get("/api/v2/categories"),
    getCategoryById: (categoryId) =>
        apiClient.get(`/api/v2/categories/${categoryId}`),
    createCategory: (data) => apiClient.post("/api/v2/categories", data),
    updateCategory: (categoryId, data) =>
        apiClient.put(`/api/v2/categories/${categoryId}`, data),
    deleteCategory: (categoryId) =>
        apiClient.delete(`/api/v2/categories/${categoryId}`),

    // Badges
    getAllBadges: () => apiClient.get("/api/v2/admin/gamification/badges"),
    getBadgeById: (badgeId) =>
        apiClient.get(`/api/v2/admin/gamification/badges/${badgeId}`),
    createBadge: (data) =>
        apiClient.post("/api/v2/admin/gamification/badges", data),
    updateBadge: (badgeId, data) =>
        apiClient.put(`/api/v2/admin/gamification/badges/${badgeId}`, data),
    deleteBadge: (badgeId) =>
        apiClient.delete(`/api/v2/admin/gamification/badges/${badgeId}`),

    // Transactions
    getTransactionStats: () =>
        apiClient.get("/api/v2/transactions/stats"),
    getTransactionsAsSharer: (page = 1, size = 50) =>
        apiClient.get("/api/v2/transactions/as-sharer", { params: { page, size } }),
    getTransactionsAsReceiver: (page = 1, size = 50) =>
        apiClient.get("/api/v2/transactions/as-receiver", { params: { page, size } }),
    getTransactionById: (transactionId) =>
        apiClient.get(`/api/v2/transactions/${transactionId}`),
    getAllTransactionsAdmin: (page = 1, size = 50) =>
        apiClient.get("/api/v2/transactions/admin/all", { params: { page, size } }),

    // Reports
    getPendingReports: (page = 1, size = 20) =>
        apiClient.get("/api/v2/reports/pending", { params: { page, size } }),
    getMyReports: (page = 1, size = 20) =>
        apiClient.get("/api/v2/reports/my", { params: { page, size } }),
    resolveReport: (reportId, data) =>
        apiClient.put(`/api/v2/reports/${reportId}/resolve`, data),
    dismissReport: (reportId, data) =>
        apiClient.put(`/api/v2/reports/${reportId}/dismiss`, data),
    createReport: (data) =>
        apiClient.post("/api/v2/reports", data),
};

export default apiClient;
