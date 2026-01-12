import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";

export default function StatisticsPage() {
    const [stats, setStats] = useState([
        { label: "Tổng giao dịch", value: "0", color: "bg-blue-500", loading: true },
        { label: "Giao dịch thành công", value: "0", color: "bg-green-500", loading: true },
        { label: "Giao dịch thất bại", value: "0", color: "bg-red-500", loading: true },
        { label: "Tỷ lệ thành công", value: "0%", color: "bg-purple-500", loading: true },
    ]);
    const [transactionData, setTransactionData] = useState([]);
    const [successRateData, setSuccessRateData] = useState([
        { name: "Thành công", value: 0, fill: "#10b981" },
        { name: "Thất bại", value: 0, fill: "#ef4444" },
    ]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchStatistics();
        // Set default date range to last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);

    const fetchStatistics = async () => {
        try {
            // Fetch all transactions using admin endpoint
            let transactions = [];
            try {
                const txnResponse = await adminApi.getAllTransactionsAdmin(1, 500);
                transactions = txnResponse.data.data.data || [];
            } catch (err) {
                console.warn("Could not fetch transactions from admin endpoint, trying sharer endpoint:", err);
                // Fallback to sharer endpoint if admin endpoint fails
                try {
                    const txnResponse = await adminApi.getTransactionsAsSharer(1, 500);
                    transactions = txnResponse.data.data.data || [];
                } catch (err2) {
                    console.warn("Could not fetch transactions from sharer endpoint either, using empty data:", err2);
                    transactions = [];
                }
            }

            // Store all transactions
            setAllTransactions(transactions);
            updateCharts(transactions);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const updateCharts = (transactions) => {
        // Filter by date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const filteredTransactions = transactions.filter(t => {
            const txnDate = new Date(t.createdAt);
            return txnDate >= start && txnDate <= end;
        });

        // Calculate stats
        const totalTransactions = filteredTransactions.length;
        const successfulTransactions = filteredTransactions.filter(t => t.status === "COMPLETED").length;
        const failedTransactions = filteredTransactions.filter(t => t.status === "REJECTED" || t.status === "CANCELLED").length;
        const successRate = totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) : 0;

        setStats([
            { label: "Tổng giao dịch", value: totalTransactions.toString(), color: "bg-blue-500", loading: false },
            { label: "Giao dịch thành công", value: successfulTransactions.toString(), color: "bg-green-500", loading: false },
            { label: "Giao dịch thất bại", value: failedTransactions.toString(), color: "bg-red-500", loading: false },
            { label: "Tỷ lệ thành công", value: successRate + "%", color: "bg-purple-500", loading: false },
        ]);

        setSuccessRateData([
            { name: "Thành công", value: successfulTransactions, fill: "#10b981" },
            { name: "Thất bại", value: failedTransactions, fill: "#ef4444" },
        ]);

        // Process transaction data by date
        const txnByDate = {};
        filteredTransactions.forEach(t => {
            const date = new Date(t.createdAt).toLocaleDateString('vi-VN');
            if (!txnByDate[date]) {
                txnByDate[date] = { date, successful: 0, failed: 0 };
            }
            if (t.status === "COMPLETED") {
                txnByDate[date].successful++;
            } else if (t.status === "REJECTED" || t.status === "CANCELLED") {
                txnByDate[date].failed++;
            }
        });

        const chartData = Object.values(txnByDate);
        setTransactionData(chartData);

        // Get recent transactions
        setRecentTransactions(filteredTransactions.slice(0, 5).map(t => ({
            id: t.id?.substring(0, 8) || "N/A",
            amount: `₫${(t.amount || 0).toLocaleString('vi-VN')}`,
            status: t.status === "COMPLETED" ? "success" : t.status === "PENDING" ? "pending" : "failed",
            time: new Date(t.createdAt).toLocaleTimeString('vi-VN'),
        })));
    };

    const handleDateChange = () => {
        updateCharts(allTransactions);
    };

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
                                        {stat.loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Date Range Selector */}
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn khoảng thời gian</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleDateChange}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    {/* Transactions Chart */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Giao dịch theo ngày ({startDate} - {endDate})
                        </h2>
                        <ResponsiveContainer width="100%" height={400}>
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
                                {recentTransactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-900 font-mono">{txn.id}</td>
                                        <td className="px-6 py-4 text-gray-900 font-semibold">
                                            {txn.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${txn.status === "success"
                                                    ? "bg-green-100 text-green-700"
                                                    : txn.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {txn.status === "success" ? "Thành công" : txn.status === "pending" ? "Đang xử lý" : "Thất bại"}
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
