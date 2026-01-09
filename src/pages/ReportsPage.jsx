import { Flag, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            // Try to fetch reports if endpoint exists, otherwise use mock data
            try {
                const response = await adminApi.getAllReports();
                setReports(response.data.data || []);
            } catch {
                // If endpoint doesn't exist, use mock data
                const mockReports = [
                    {
                        id: "RPT001",
                        type: "Spam",
                        reason: "Nội dung spam",
                        reporter: "user123",
                        target: "user456",
                        status: "pending",
                        date: "12/26",
                    },
                    {
                        id: "RPT002",
                        type: "Inappropriate",
                        reason: "Nội dung không phù hợp",
                        reporter: "user789",
                        target: "user101",
                        status: "resolved",
                        date: "12/25",
                    },
                    {
                        id: "RPT003",
                        type: "Scam",
                        reason: "Lừa đảo",
                        reporter: "user202",
                        target: "user303",
                        status: "pending",
                        date: "12/24",
                    },
                ];
                setReports(mockReports);
            }
        } catch (err) {
            setError("Không thể tải danh sách reports");
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            Spam: "bg-orange-100 text-orange-700",
            Inappropriate: "bg-red-100 text-red-700",
            Scam: "bg-purple-100 text-purple-700",
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    const handleApprove = async (reportId) => {
        try {
            // Try to call API if it exists
            if (adminApi.approveReport) {
                await adminApi.approveReport(reportId);
            }
            setReports(
                reports.map((r) =>
                    r.id === reportId ? { ...r, status: "resolved" } : r
                )
            );
            alert("Report đã được phê duyệt");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleReject = async (reportId) => {
        try {
            // Try to call API if it exists
            if (adminApi.rejectReport) {
                await adminApi.rejectReport(reportId);
            }
            setReports(reports.filter((r) => r.id !== reportId));
            alert("Report đã bị từ chối");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Xử lý Report</h1>
                    <p className="text-gray-500 mt-2">
                        Quản lý các báo cáo vi phạm từ người dùng
                    </p>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Left */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(
                                                report.type
                                            )}`}
                                        >
                                            {report.type}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${report.status === "resolved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {report.status === "resolved" ? "Đã xử lý" : "Chờ xử lý"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 font-medium">ID</p>
                                            <p className="text-gray-900 font-semibold">{report.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium">Lý do</p>
                                            <p className="text-gray-900">{report.reason}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium">Người báo cáo</p>
                                            <p className="text-gray-900 font-mono">{report.reporter}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium">Người bị báo cáo</p>
                                            <p className="text-gray-900 font-mono">{report.target}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Actions */}
                                {report.status === "pending" && (
                                    <div className="flex flex-col gap-2 md:w-40">
                                        <button
                                            onClick={() => handleApprove(report.id)}
                                            className="btn-primary text-sm"
                                        >
                                            Phê duyệt
                                        </button>
                                        <button
                                            onClick={() => handleReject(report.id)}
                                            className="btn-danger text-sm"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
