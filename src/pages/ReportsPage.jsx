import { Flag, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";

export default function ReportsPage() {
    const reports = [
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

    const getTypeColor = (type) => {
        const colors = {
            Spam: "bg-orange-100 text-orange-700",
            Inappropriate: "bg-red-100 text-red-700",
            Scam: "bg-purple-100 text-purple-700",
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    const handleApprove = (reportId) => {
        alert(`Report ${reportId} đã được phê duyệt`);
    };

    const handleReject = (reportId) => {
        alert(`Report ${reportId} đã bị từ chối`);
    };

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
