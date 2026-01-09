import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import { adminApi } from "../services/api";
import { mockCategories } from "../services/mockData";

const ITEMS_PER_PAGE = 9;

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllCategories();
            setCategories(response.data.data.data || []);
            setCurrentPage(1);
        } catch (err) {
            setError("Không thể tải danh sách category");
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa category này?")) return;

        try {
            await adminApi.deleteCategory(categoryId);
            setCategories(
                categories.filter((c) => c.id !== categoryId)
            );
            alert("Xóa category thành công");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    // Pagination logic
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedCategories = categories.slice(startIdx, endIdx);

    const getIconEmoji = (iconName) => {
        const iconMap = {
            furniture: "🛋️",
            electronics: "📱",
            clothing: "👕",
            books: "📚",
            sports: "⚽",
            toys: "🧸",
            kitchen: "🍳",
            home: "🏠",
            garden: "🌿",
            pets: "🐕",
            tools: "🔧",
            music: "🎵",
            default: "📁",
        };
        return iconMap[iconName?.toLowerCase()] || iconMap.default;
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
                        <h1 className="text-4xl font-bold text-gray-900">
                            Quản lý Category
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Tổng cộng: {categories.length} category - Trang {currentPage}/{totalPages || 1}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Thêm Category
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedCategories.map((category) => (
                        <div
                            key={category.id}
                            className="card p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                                    style={{
                                        backgroundColor: category.color || "#2563eb",
                                    }}
                                >
                                    {getIconEmoji(category.icon)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Edit size={18} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteCategory(category.id)
                                        }
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Trash2 size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {category.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {category.description}
                            </p>
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

                {/* Modal */}
                {showModal && (
                    <CategoryModal
                        category={editingCategory}
                        onClose={() => setShowModal(false)}
                        onSuccess={fetchCategories}
                    />
                )}
            </div>
        </Layout>
    );
}

function CategoryModal({ category, onClose, onSuccess }) {
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [color, setColor] = useState(category?.color || "#2563eb");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên category");
            return;
        }

        try {
            setLoading(true);
            const categoryData = {
                name: name.trim(),
                description: description.trim(),
                color: color,
            };

            if (category) {
                await adminApi.updateCategory(category.id, categoryData);
                alert("Cập nhật category thành công");
            } else {
                await adminApi.createCategory(categoryData);
                alert("Thêm category thành công");
            }
            onClose();
            onSuccess();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const colors = [
        "#2563eb",
        "#16a34a",
        "#ea580c",
        "#dc2626",
        "#9333ea",
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {category ? "Chỉnh sửa Category" : "Thêm Category"}
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
                            placeholder="Nhập tên category"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Màu sắc
                        </label>
                        <div className="flex gap-2">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${color === c ? "border-gray-900 ring-2 ring-offset-2" : "border-gray-200"
                                        }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
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
                            {loading ? "Đang xử lý..." : category ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
