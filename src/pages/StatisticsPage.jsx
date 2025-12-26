import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Layout from "../components/Layout";

export default function StatisticsPage() {
    const transactionData = [
        { date: "12/20", transactions: 45, successful: 43, failed: 2 },
        { date: "12/21", transactions: 52, successful: 50, failed: 2 },
        { date: "12/22", transactions: 48, successful: 46, failed: 2 },
        { date: "12/23", transactions: 61, successful: 58, failed: 3 },
        { date: "12/24", transactions: 55, successful: 53, failed: 2 },
        { date: "12/25", transactions: 67, successful: 65, failed: 2 },
        { date: "12/26", transactions: 45, successful: 43, failed: 2 },
    ];

    const revenueData = [
        { date: "12/20", revenue: 1850000 },
        { date: "12/21", revenue: 2100000 },
        { date: "12/22", revenue: 1950000 },
        { date: "12/23", revenue: 2450000 },
        { date: "12/24", revenue: 2200000 },
        { date: "12/25", revenue: 2700000 },
        { date: "12/26", revenue: 1800000 },
    ];

    const successRateData = [
        { name: "Thành công", value: 1850, fill: "#10b981" },
        { name: "Thất bại", value: 45, fill: "#ef4444" },
    ];

    const stats = [
        { label: "Tổng giao dịch", value: "373", color: "bg-blue-500" },
        { label: "Giao dịch thành công", value: "358", color: "bg-green-500" },
        { label: "Giao dịch thất bại", value: "15", color: "bg-red-500" },
        { label: "Tỷ lệ thành công", value: "95.9%", color: "bg-purple-500" },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Thống kê</h1>
                    <p className="text-gray-500 mt-2">Phân tích chi tiết hoạt động hệ thống</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Transactions Chart */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Giao dịch theo ngày
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={transactionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="successful" fill="#10b981" name="Thành công" />
                                <Bar dataKey="failed" fill="#ef4444" name="Thất bại" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue Chart */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Doanh thu theo ngày
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₫${(value / 1000000).toFixed(1)}M`} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Success Rate Pie Chart */}
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Tỷ lệ thành công/thất bại
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={successRateData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {successRateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Table */}
                <div className="card overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Chi tiết giao dịch hôm nay
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Số tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Thời gian
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { id: "TXN001", amount: "₫45,000", status: "success", time: "14:30" },
                                    { id: "TXN002", amount: "₫32,500", status: "success", time: "14:15" },
                                    { id: "TXN003", amount: "₫58,000", status: "success", time: "13:45" },
                                    { id: "TXN004", amount: "₫1,200", status: "failed", time: "13:20" },
                                    { id: "TXN005", amount: "₫41,000", status: "success", time: "12:50" },
                                ].map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-900 font-mono">{txn.id}</td>
                                        <td className="px-6 py-4 text-gray-900 font-semibold">
                                            {txn.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${txn.status === "success"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {txn.status === "success" ? "Thành công" : "Thất bại"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{txn.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
