import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

const PAGE_SIZE = 20;

export default function ReportsPage() {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [modalType, setModalType] = useState(""); // "resolve" or "dismiss"

    useEffect(() => {
        console.log("Current user:", user);
        console.log("User role:", user?.role || user?.roles);
        console.log("Token:", token ? "Present" : "Missing");
        fetchReports(currentPage);
    }, [currentPage, user, token]);

    const fetchReports = async (page) => {
        try {
            setLoading(true);
            console.log("Fetching reports from page:", page);
            // Backend uses 0-based pagination, so subtract 1
            const apiPage = page - 1;
            const response = await adminApi.getPendingReports(apiPage, PAGE_SIZE);
            console.log("Reports response:", response);
            console.log("Response data:", response.data);
            setReports(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems || 0);
        } catch (err) {
            console.error("Full error object:", err);
            console.error("Error response:", err.response);
            console.error("Error message:", err.message);
            setError("Không thể tải danh sách reports: " + (err.response?.data?.message || err.message));
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            SPAM: "bg-orange-100 text-orange-700",
            INAPPROPRIATE_CONTENT: "bg-red-100 text-red-700",
            SCAM: "bg-purple-100 text-purple-700",
            HARASSMENT: "bg-pink-100 text-pink-700",
            COPYRIGHT: "bg-blue-100 text-blue-700",
            OTHER: "bg-gray-100 text-gray-700",
        };
        return colors[category] || "bg-gray-100 text-gray-700";
    };

    const getCategoryLabel = (category) => {
        const labels = {
            SPAM: "Spam",
            INAPPROPRIATE_CONTENT: "Nội dung không phù hợp",
            SCAM: "Lừa đảo",
            HARASSMENT: "Qu騷rối",
            COPYRIGHT: "Vi phạm bản quyền",
            OTHER: "Khác",
        };
        return labels[category] || category;
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: "bg-yellow-100 text-yellow-700",
            RESOLVED: "bg-green-100 text-green-700",
            DISMISSED: "bg-gray-100 text-gray-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getStatusLabel = (status) => {
        const labels = {
            PENDING: "Chờ xử lý",
            RESOLVED: "Đã xử lý",
            DISMISSED: "Bỏ qua",
        };
        return labels[status] || status;
    };

    const openModal = (report, type) => {
        setSelectedReport(report);
        setModalType(type);
        setShowModal(true);
    };

    const handleResolve = async (action, notes) => {
        try {
            setLoading(true);
            await adminApi.resolveReport(selectedReport.id, { action, notes });
            setShowModal(false);
            await fetchReports(currentPage);
            alert("Report đã được xử lý thành công");
        } catch (err) {
            setError("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = async (reason) => {
        try {
            setLoading(true);
            await adminApi.dismissReport(selectedReport.id, { reason });
            setShowModal(false);
            await fetchReports(currentPage);
            alert("Report đã bị bỏ qua");
        } catch (err) {
            setError("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Flag className="w-6 h-6 text-red-500" />
                        <h1 className="text-3xl font-bold">Xử lý Report</h1>
                    </div>
                    <div className="text-sm text-gray-600">
                        {totalItems} reports ({totalPages} trang)
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10">
                        <p>Đang tải...</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            {reports.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
                                    Không có reports nào
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="bg-white rounded-lg shadow p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                                                            report.category
                                                        )}`}
                                                    >
                                                        {getCategoryLabel(
                                                            report.category
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            report.status
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="font-semibold mb-2">
                                                    {report.description}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    <span className="font-medium">
                                                        Người báo cáo:
                                                    </span>{" "}
                                                    ID {report.reporterId}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    <span className="font-medium">
                                                        Loại:
                                                    </span>{" "}
                                                    {report.targetType}
                                                </p>
                                                {report.adminNotes && (
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        <span className="font-medium">
                                                            Ghi chú:
                                                        </span>{" "}
                                                        {report.adminNotes}
                                                    </p>
                                                )}
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(
                                                        report.createdAt
                                                    ).toLocaleString("vi-VN")}
                                                </p>
                                            </div>
                                            {report.status === "PENDING" && (
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() =>
                                                            openModal(
                                                                report,
                                                                "resolve"
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        Xử lý
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openModal(
                                                                report,
                                                                "dismiss"
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                                    >
                                                        Bỏ qua
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() =>
                                    setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Trước
                            </button>
                            <span className="text-sm text-gray-600">
                                Trang {currentPage}/{totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(totalPages, currentPage + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Tiếp
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}

                {/* Modals */}
                {showModal && modalType === "resolve" && (
                    <ResolveModal
                        report={selectedReport}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleResolve}
                    />
                )}
                {showModal && modalType === "dismiss" && (
                    <DismissModal
                        report={selectedReport}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleDismiss}
                    />
                )}
            </div>
        </Layout>
    );
}

function ResolveModal({ report, onClose, onSubmit }) {
    const [action, setAction] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!action.trim()) {
            alert("Vui lòng nhập hành động");
            return;
        }
        setLoading(true);
        try {
            await onSubmit(action, notes);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Xử lý Report</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hành động
                        </label>
                        <input
                            type="text"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            placeholder="Mô tả hành động xử lý (bắt buộc)"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength="255"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Ghi chú (tùy chọn)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ghi chú thêm về quyết định xử lý"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            maxLength="2000"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Xử lý"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DismissModal({ report, onClose, onSubmit }) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Vui lòng nhập lý do");
            return;
        }
        setLoading(true);
        try {
            await onSubmit(reason);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Bỏ qua Report</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Lý do bỏ qua
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Giải thích lý do bỏ qua report này"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            maxLength="2000"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang bỏ qua..." : "Bỏ qua"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
