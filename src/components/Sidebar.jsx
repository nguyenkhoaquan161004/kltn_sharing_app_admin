import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Folder,
    Star,
    Flag,
    BarChart3,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Quản lý User",
            path: "/users",
            icon: Users,
        },
        {
            label: "Quản lý Category",
            path: "/categories",
            icon: Folder,
        },
        {
            label: "Quản lý Danh hiệu",
            path: "/badges",
            icon: Star,
        },
        {
            label: "Xử lý Report",
            path: "/reports",
            icon: Flag,
        },
        {
            label: "Thống kê",
            path: "/statistics",
            icon: BarChart3,
        },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-0"
                    } overflow-hidden md:w-64`}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-600">SA</span>
                        </div>
                        <div>
                            <h1 className="font-bold">Shario Admin</h1>
                            <p className="text-xs text-blue-100">Management</p>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-white text-blue-600"
                                        : "text-blue-100 hover:bg-blue-500"
                                        }`}
                                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Close sidebar on mobile when clicking backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
