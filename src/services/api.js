import axios from "axios";

// Dev: use relative path (proxied), Production: use absolute URL
const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "development" ? "" : "https://shareo.studio");

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
        apiClient.post("/api/v2/auth/login", {
            usernameOrEmail: email,
            password,
            rememberMe: false
        }),

    // Users
    getAllUsers: (page = 0, size = 10) =>
        apiClient.get("/api/v2/users", { params: { page, size } }),
    deleteUser: (userId) => apiClient.delete(`/api/v2/users/${userId}`),
    addPoints: (userId, points, reason) =>
        apiClient.post("/api/v2/gamification/points/add", {
            userId,
            points,
            reason,
        }),
    sendNotification: (userId, title, message) =>
        apiClient.post("/api/v2/notifications/send", { userId, title, message }),

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
};

export default apiClient;
