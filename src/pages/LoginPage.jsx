import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await adminApi.login(email, password);
            const { data } = response.data;

            setToken(data.access_token);
            setUser({ email });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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

                    {/* Demo Info */}
                    <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <p className="font-medium">Tài khoản demo:</p>
                        <p>Email: admin@shario.com</p>
                        <p>Password: (Mật khẩu của admin)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
