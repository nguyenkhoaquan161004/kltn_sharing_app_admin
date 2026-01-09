import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";
import { mockBadges } from "../services/mockData";

const ITEMS_PER_PAGE = 9;

export default function BadgesPage() {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllBadges();
            // API returns array directly in response.data.data
            const badgesData = Array.isArray(response.data.data) ? response.data.data : response.data.data.data || [];
            setBadges(badgesData);
            setCurrentPage(1);
        } catch (err) {
            setError("Không thể tải danh sách danh hiệu");
            console.error("Error fetching badges:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBadge = async (badgeId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa danh hiệu này?")) return;

        try {
            await adminApi.deleteBadge(badgeId);
            setBadges(badges.filter((b) => b.id !== badgeId));
            alert("Xóa danh hiệu thành công");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const openEditModal = (badge) => {
        setEditingBadge(badge);
        setShowModal(true);
    };

    const getRarityColor = (rarity) => {
        const colors = {
            COMMON: "bg-green-100 text-green-700",
            RARE: "bg-blue-100 text-blue-700",
            EPIC: "bg-purple-100 text-purple-700",
            LEGENDARY: "bg-yellow-100 text-yellow-700",
        };
        return colors[rarity] || colors.COMMON;
    };

    const getIconEmoji = (iconName) => {
        const iconMap = {
            "badge-newcomer": "🎉",
            "badge-first-share": "🎁",
            "badge-first-receive": "📦",
            "badge-bronze": "🥉",
            "badge-silver": "🥈",
            "badge-gold": "🥇",
            "badge-platinum": "💎",
            default: "⭐",
        };
        return iconMap[iconName?.toLowerCase()] || iconMap.default;
    };

    // Pagination logic
    const totalPages = Math.ceil(badges.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedBadges = badges.slice(startIdx, endIdx);

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
                        <h1 className="text-4xl font-bold text-gray-900">
                            Quản lý Danh hiệu
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Tổng cộng: {badges.length} danh hiệu - Trang {currentPage}/{totalPages || 1}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingBadge(null);
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Thêm Danh hiệu
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className="card p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">
                                    {getIconEmoji(badge.icon)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(badge)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Edit size={18} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteBadge(badge.id)
                                        }
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Trash2 size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {badge.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {badge.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRarityColor(badge.rarity)}`}>
                                    {badge.rarity}
                                </span>
                                {badge.pointsRequired && (
                                    <span className="text-sm text-gray-600">
                                        {badge.pointsRequired} điểm
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft size={18} />
                            Trước
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded-lg ${currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sau
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <BadgeModal
                    badge={editingBadge}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchBadges}
                />
            )}
        </Layout>
    );
}

function BadgeModal({ badge, onClose, onSuccess }) {
    const [name, setName] = useState(badge?.name || "");
    const [description, setDescription] = useState(badge?.description || "");
    const [pointsRequired, setPointsRequired] = useState(
        badge?.pointsRequired || ""
    );
    const [rarity, setRarity] = useState(badge?.rarity || "COMMON");
    const [loading, setLoading] = useState(false);

    const rarities = ["COMMON", "RARE", "EPIC", "LEGENDARY"];

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên danh hiệu");
            return;
        }

        try {
            setLoading(true);
            const badgeData = {
                name: name.trim(),
                description: description.trim(),
                pointsRequired: parseInt(pointsRequired) || 0,
                rarity: rarity,
            };

            if (badge) {
                await adminApi.updateBadge(badge.id, badgeData);
                alert("Cập nhật danh hiệu thành công");
            } else {
                await adminApi.createBadge(badgeData);
                alert("Thêm danh hiệu thành công");
            }
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
                    {badge ? "Chỉnh sửa Danh hiệu" : "Thêm Danh hiệu"}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="Nhập tên danh hiệu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input"
                            rows="3"
                            placeholder="Nhập mô tả"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Điểm yêu cầu
                        </label>
                        <input
                            type="number"
                            value={pointsRequired}
                            onChange={(e) => setPointsRequired(e.target.value)}
                            className="input"
                            placeholder="Nhập điểm yêu cầu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Độ hiếm
                        </label>
                        <select value={rarity} onChange={(e) => setRarity(e.target.value)} className="input">
                            {rarities.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 btn-secondary">
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 btn-primary"
                        >
                            {loading ? "Đang xử lý..." : badge ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
