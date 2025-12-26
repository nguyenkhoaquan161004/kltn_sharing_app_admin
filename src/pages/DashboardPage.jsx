import { Users, ShoppingCart, Folder, Flag } from "lucide-react";
import Layout from "../components/Layout";

export default function DashboardPage() {
    const stats = [
        { label: "Tổng User", value: "1,234", icon: Users, color: "bg-blue-500" },
        {
            label: "Giao dịch hôm nay",
            value: "45",
            icon: ShoppingCart,
            color: "bg-green-500",
        },
        {
            label: "Categories",
            value: "12",
            icon: Folder,
            color: "bg-orange-500",
        },
        {
            label: "Reports",
            value: "8",
            icon: Flag,
            color: "bg-red-500",
        },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-2">
                        Chào mừng bạn đến với Admin Dashboard
                    </p>
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
                                            {stat.value}
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-2">Xin chào Admin!</h2>
                    <p>
                        Bạn đang quản lý hệ thống Shario - nền tảng chia sẻ từ thiện toàn
                        cầu
                    </p>
                </div>

                {/* Quick Actions */}
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
                </div>
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
