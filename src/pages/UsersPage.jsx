import { useEffect, useState } from "react";
import { Trash2, Plus, Send } from "lucide-react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(""); // "points" or "notification"

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllUsers();
            setUsers(response.data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;

        try {
            await adminApi.deleteUser(userId);
            setUsers(users.filter((u) => u.userId !== userId));
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const openModal = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        setShowModal(true);
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Quản lý User</h1>
                        <p className="text-gray-500 mt-2">Tổng cộng: {users.length} user</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Thêm User
                    </button>
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
                                {users.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        {(user.firstName || user.username || "U")[0]}
                                                    </span>
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
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {user.trustScore || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(user, "points")}
                                                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
                                                >
                                                    Thêm điểm
                                                </button>
                                                <button
                                                    onClick={() => openModal(user, "notification")}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                >
                                                    <Send size={16} />
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
                                ))}
                            </tbody>
                        </table>
                    </div>
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
        </Layout>
    );
}

function Modal({ type, user, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [pointsValue, setPointsValue] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleAddPoints = async () => {
        try {
            setLoading(true);
            await adminApi.addPoints(user.userId, parseInt(pointsValue), "Admin reward");
            alert("Thêm điểm thành công");
            onClose();
            onSuccess();
        } catch (err) {
            alert("Lỗi: " + err.message);
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
            alert("Lỗi: " + err.message);
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
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 btn-secondary">
                                Hủy
                            </button>
                            <button
                                onClick={handleAddPoints}
                                disabled={loading}
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
