import { useEffect, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";
import { mockUsers } from "../services/mockData";

const PAGE_SIZE = 20;

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(""); // "points" or "notification"
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            const response = await adminApi.getAllUsers(page, PAGE_SIZE);
            setUsers(response.data.data.data || []);
            setTotalPages(response.data.data.totalPages || 1);
            setTotalItems(response.data.data.totalItems || 0);
        } catch (err) {
            setError("Không thể tải danh sách user");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;

        try {
            await adminApi.deleteUser(userId);
            setUsers(users.filter((u) => u.userId !== userId));
            alert("Xóa user thành công");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const openModal = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        setShowModal(true);
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            (user.firstName && user.firstName.toLowerCase().includes(query)) ||
            (user.username && user.username.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query))
        );
    });

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
                    <h1 className="text-4xl font-bold text-gray-900">Quản lý User</h1>
                    <p className="text-gray-500 mt-2">Tổng cộng: {totalItems} user - Trang {currentPage}/{totalPages}</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm user theo tên, username, hoặc email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Users Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Trust Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                    {user.profilePicture ? (
                                                        <img
                                                            src={user.profilePicture}
                                                            alt={user.firstName || user.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {(user.firstName || user.username || "U")[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.firstName || user.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {user.trustScore || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(user, "points")}
                                                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm font-medium"
                                                >
                                                    Thêm điểm
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.userId)}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery ? "Không tìm thấy user" : "Không có user"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Hiển thị {users.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, totalItems)} trong {totalItems} user
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft size={18} />
                            Trang trước
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="px-3 py-2 text-sm font-medium text-gray-700">
                                Trang {currentPage}/{totalPages}
                            </span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Trang sau
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Modals */}
                {showModal && selectedUser && (
                    <Modal
                        type={modalType}
                        user={selectedUser}
                        onClose={() => setShowModal(false)}
                        onSuccess={fetchUsers}
                    />
                )}
            </div>
        </Layout>
    );
}

function Modal({ type, user, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [pointsValue, setPointsValue] = useState("");
    const [pointsReason, setPointsReason] = useState("");
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleAddPoints = async () => {
        try {
            setLoading(true);
            const reason = pointsReason || "Hoạt động trên nền tảng";

            // Add points
            await adminApi.addPoints(user.userId, parseInt(pointsValue), reason);

            // Always send notification
            const notificationMsg = `Bạn được cộng ${pointsValue} điểu vì lý do: ${reason}`;
            await adminApi.sendNotification(
                user.userId,
                "Thông báo từ quản trị viên",
                notificationMsg
            );

            alert("Thêm điểm thành công");
            onClose();
            onSuccess();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async () => {
        try {
            setLoading(true);
            await adminApi.sendNotification(user.userId, title, message);
            alert("Gửi thông báo thành công");
            onClose();
            onSuccess();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {type === "points" ? "Thêm điểm" : "Gửi thông báo"}
                </h2>

                {type === "points" ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điểm
                            </label>
                            <input
                                type="number"
                                value={pointsValue}
                                onChange={(e) => setPointsValue(e.target.value)}
                                className="input"
                                placeholder="Nhập số điểm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lý do
                            </label>
                            <textarea
                                value={pointsReason}
                                onChange={(e) => setPointsReason(e.target.value)}
                                className="input"
                                rows="2"
                                placeholder="Nhập lý do thêm điểm (tùy chọn)"
                            />
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Thông báo cho user (tùy chọn)</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiêu đề thông báo
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationTitle}
                                        onChange={(e) => setNotificationTitle(e.target.value)}
                                        className="input"
                                        placeholder="VD: Bạn nhận được điểm mới"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nội dung thông báo
                                    </label>
                                    <textarea
                                        value={notificationMessage}
                                        onChange={(e) => setNotificationMessage(e.target.value)}
                                        className="input"
                                        rows="2"
                                        placeholder="Nhập nội dung thông báo"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 btn-secondary">
                                Hủy
                            </button>
                            <button
                                onClick={handleAddPoints}
                                disabled={loading || !pointsValue}
                                className="flex-1 btn-primary"
                            >
                                {loading ? "Đang xử lý..." : "Thêm"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input"
                                placeholder="Nhập tiêu đề"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="input"
                                rows="4"
                                placeholder="Nhập nội dung thông báo"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 btn-secondary">
                                Hủy
                            </button>
                            <button
                                onClick={handleSendNotification}
                                disabled={loading}
                                className="flex-1 btn-primary"
                            >
                                {loading ? "Đang gửi..." : "Gửi"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
