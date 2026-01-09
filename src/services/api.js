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

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_access_token");
            localStorage.removeItem("admin_refresh_token");
            window.location.href = "/login";
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

    // Reports (Optional - endpoints may not exist)
    getAllReports: () =>
        apiClient.get("/api/v2/admin/reports").catch(() => ({
            data: { data: [] },
        })),
    approveReport: (reportId) =>
        apiClient.put(`/api/v2/admin/reports/${reportId}/approve`),
    rejectReport: (reportId) =>
        apiClient.put(`/api/v2/admin/reports/${reportId}/reject`),
};

export default apiClient;
