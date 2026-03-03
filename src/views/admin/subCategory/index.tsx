import { FC, useEffect, useState } from "react"
import { Plus, Layers, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import useSubCategories, { SubCategory } from "../../../hooks/subCategory/useSubCategories"
import useSubCategoryDelete from "../../../hooks/subCategory/useSubCategoryDelete"

import ActionDropdown from "../../../components/ActionDropdown"
import CreateSubCategoryModal from "./create"
import EditSubCategoryModal from "./edit"

const SubCategoryPage: FC = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: subCategories, isLoading, isError, error } =
    useSubCategories(categoryId!)

  const deleteSubCategory = useSubCategoryDelete(categoryId!)

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null)

  useEffect(() => {
    document.title = "Category - SubCategory Management"
  }, [])

  // ===== DELETE =====
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this sub category?")) return

    const toastId = toast.loading("Deleting sub category...")

    deleteSubCategory.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", categoryId],
        })
        toast.success("Sub category deleted successfully", { id: toastId })
      },
      onError: () => {
        toast.error("Failed to delete sub category", { id: toastId })
      },
    })
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/categories")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
          >
            <ArrowLeft size={14} /> Back to Category
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            SubCategory Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage sub categories inside selected category
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Add SubCategory
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total SubCategories</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {subCategories?.length || 0}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Layers className="text-blue-400" size={20} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        {isLoading && (
          <p className="text-gray-400">Loading sub categories...</p>
        )}

        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <table className="min-w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subCategories?.map((sub) => (
                <tr
                  key={sub.id}
                  className="group border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-6 py-4 text-yellow-400 font-semibold">
                    {sub.name}
                  </td>

                  <td className="px-6 py-4 text-white">
                    {sub.slug}
                  </td>

                  <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionDropdown
                      items={[
                        {
                          label: "Update",
                          icon: Pencil,
                          onClick: () => {
                            setSelectedSubCategory(sub)
                            setIsEditOpen(true)
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDelete(sub.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && subCategories?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No sub categories found.
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateSubCategoryModal
        categoryId={categoryId!}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["subcategories", categoryId],
          })
        }
      />

      {/* EDIT MODAL */}
      <EditSubCategoryModal
        categoryId={categoryId!}
        isOpen={isEditOpen}
        subCategory={selectedSubCategory}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["subcategories", categoryId],
          })
        }
      />

    </div>
  )
}

export default SubCategoryPage