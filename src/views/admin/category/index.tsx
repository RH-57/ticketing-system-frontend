import { FC, useEffect, useState } from "react";
import useCategories, { Category } from "../../../hooks/category/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ArrowLeft, Layers2, Pencil, Plus, Trash2 } from "lucide-react";
import ActionDropdown from "../../../components/ActionDropdown";
import CreateCategoryModal from "./create";
import toast from "react-hot-toast";
import useCategoryDelete from "../../../hooks/category/useCategoryDelete";
import EditCategoryModal from "../category/edit";

const CategoryPage: FC = () => {
    const {data: categories, isLoading, isError, error} = useCategories()
    const queryClient = useQueryClient()
    const deleteCategory = useCategoryDelete()
    
    const [open, setOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const navigate = useNavigate()

    const handleDelete = (id: number) => {
        if (!confirm("Are you sure to delete this Category?")) return

        const toastId = toast.loading("Deleteing category...")

        deleteCategory.mutate(id, {
            onSuccess: () => {
                toast.success("Category deleted successfully", {id: toastId})
            },
            onError: () => {
                toast.error("Failed to delete category", {id: toastId})
            },
        })
    }

    useEffect(() => {
        document.title = "Categories Management - Ticketing System"
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button 
                        onClick={() => navigate("/admin/dashboard")}
                        className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2">
                            <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Category Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base mt-1">
                        Manage your Category
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs">Total Categories</p>
                        <h2 className="text-2xl font-bold text-white mt-1">
                            {categories?.length || 0}
                        </h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Layers2 className="text-yellow-400" size={20} />
                    </div>
                </div> 
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
                {isLoading && <p className="text-gray-400">Loading categories...</p>}

                {isError && (
                    <p className="text-red-500">
                        {error?.message || "Something went wrong"}
                    </p>
                )}

                {!isLoading && !isError && (
                    <table className="min-w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-800">
                            <tr>
                                <th className="px-6 py-2">Name</th>
                                <th className="px-6 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((category) => (
                                <tr
                                    key={category.id}
                                    className="group border-b border-gray-800 hover:bg-gray-800/40 transition cursor-pointer"
                                    onClick={() => navigate(`/admin/categories/${category.id}`)}
                                >
                                    <td className="px-6 py-2 text-white font-medium">
                                        <button
                                            onClick={() => navigate(`/admin/categories/${category.id}`)}
                                            className="text-yellow-400 hover:text-yellow-300 hover:underline font-semibold transition"
                                        >
                                            {category.name}
                                        </button>
                                    </td>
                                    <td
                                        className="px-6 py-2 text-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ActionDropdown
                                        items={[
                                            {
                                            label: "Update",
                                            icon: Pencil,
                                            onClick: () => {
                                                setSelectedCategory(category)
                                                setIsEditOpen(true)
                                            },
                                            },
                                            {
                                            label: "Delete",
                                            icon: Trash2,
                                            danger: true,
                                            onClick: () => handleDelete(category.id),
                                            },
                                        ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!isLoading && categories?.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No Categories found.
                </div>
                )}
            </div>

            {/* CREATE MODAL */}
            <CreateCategoryModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["categories"] })
            }
            />

            <EditCategoryModal
                isOpen={isEditOpen}
                category={selectedCategory}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["categories"]})}
            />
        </div>
    )
}

export default CategoryPage