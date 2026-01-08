import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState("sharioforever@gmail.com");
    const [password, setPassword] = useState("12341234");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await adminApi.login(email, password);
            
            // Extract tokens and user data from response
            const { data } = response.data;
            
            if (data.access_token) {
                // Store tokens in localStorage
                localStorage.setItem("admin_access_token", data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem("admin_refresh_token", data.refresh_token);
                }
                
                // Store user info in auth store
                setToken(data.access_token);
                setUser({
                    email: data.user?.email || email,
                    id: data.user?.id,
                    username: data.user?.username,
                });
                
                navigate("/dashboard");
            } else {
                setError("Không nhận được token từ server");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Đăng nhập thất bại";
            setError(errorMessage);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-white">SA</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-2">Quản lý hệ thống Shario</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="admin@shario.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pr-10"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <AlertCircle size={20} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary mt-6"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}
