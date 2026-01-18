import { Users, ShoppingCart, Folder, Flag, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";

export default function DashboardPage() {
    const [stats, setStats] = useState([
        { label: "Tổng User", value: "0", icon: Users, color: "bg-emerald-500", loading: true },
        {
            label: "Tổng Giao dịch",
            value: "0",
            icon: ShoppingCart,
            color: "bg-cyan-500",
            loading: true,
        },
        {
            label: "Categories",
            value: "0",
            icon: Folder,
            color: "bg-yellow-500",
            loading: true,
        },
        {
            label: "Reports",
            value: "0",
            icon: Flag,
            color: "bg-red-500",
            loading: true,
        },
    ]);

    useEffect(() => {
        fetchDashboardData();
        
        // Auto-refresh dashboard data every 10 seconds
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch total users
            const usersResponse = await adminApi.getAllUsers(1, 1);
            const totalUsers = usersResponse.data.data.totalItems || 0;

            // Fetch all categories
            const categoriesResponse = await adminApi.getAllCategories();
            const totalCategories = categoriesResponse.data.data.data?.length || 0;

            // Fetch transaction stats
            const statsResponse = await adminApi.getTransactionStats();
            const transactionStats = statsResponse.data.data || {};

            // Fetch all transactions (admin)
            const transactionsResponse = await adminApi.getAllTransactionsAdmin(1, 1);
            const totalTransactions = transactionsResponse.data.data?.totalItems || 0;

            // Fetch pending reports
            let totalReports = 0;
            try {
                const reportsResponse = await adminApi.getPendingReports(0, 1);
                console.log("[Dashboard] Reports response:", reportsResponse);
                console.log("[Dashboard] Reports data:", reportsResponse.data);
                totalReports = reportsResponse.data.totalItems || 0;
                console.log("[Dashboard] Total reports:", totalReports);
            } catch (err) {
                console.error("Error fetching reports:", err);
                totalReports = 0;
            }

            setStats(prev => [
                { ...prev[0], value: totalUsers.toString(), loading: false },
                { ...prev[1], value: totalTransactions.toString(), loading: false },
                { ...prev[2], value: totalCategories.toString(), loading: false },
                { ...prev[3], value: totalReports.toString(), loading: false },
            ]);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setStats(prev => prev.map(stat => ({ ...stat, loading: false })));
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-2">
                            Chào mừng bạn đến với Admin Dashboard
                        </p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="Refresh dashboard data"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="card p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.loading ? (
                                                <span className="animate-pulse">...</span>
                                            ) : (
                                                stat.value
                                            )}
                                        </p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-8 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-2">Xin chào Admin!</h2>
                    <p>
                        Bạn đang quản lý hệ thống Shario - nền tảng chia sẻ từ thiện toàn
                        cầu
                    </p>
                </div>

                {/* Quick Actions
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickActionCard
                        title="Thêm User"
                        icon="👤"
                        path="/users"
                    />
                    <QuickActionCard
                        title="Thêm Category"
                        icon="📁"
                        path="/categories"
                    />
                    <QuickActionCard
                        title="Thêm Danh hiệu"
                        icon="⭐"
                        path="/badges"
                    />
                    <QuickActionCard
                        title="Xem Thống kê"
                        icon="📊"
                        path="/statistics"
                    />
                </div> */}
            </div>
        </Layout>
    );
}

function QuickActionCard({ title, icon, path }) {
    return (
        <a
            href={path}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
        </a>
    );
}
