import { FC, useEffect, useState } from "react"
import { Plus, Package, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import useItems, { Item } from "../../../hooks/item/useItems"
import useItemDelete from "../../../hooks/item/useItemDelete"

import ActionDropdown from "../../../components/ActionDropdown"
import CreateItemModal from "./create"
import EditItemModal from "./edit"

const ItemPage: FC = () => {
  const { categoryId, subCategoryId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: items, isLoading, isError, error } =
    useItems(categoryId!, subCategoryId!)

  const deleteItem = useItemDelete()

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    document.title = "Category - Item Management"
  }, [])

  // ===== DELETE =====
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    const toastId = toast.loading("Deleting item...")

    deleteItem.mutate(
      {
        id,
        categoryId: categoryId!,
        subCategoryId: subCategoryId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["items", categoryId, subCategoryId],
          })
          toast.success("Item deleted successfully", { id: toastId })
        },
        onError: () => {
          toast.error("Failed to delete item", { id: toastId })
        },
      }
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() =>
              navigate(`/admin/categories/${categoryId}`)
            }
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
          >
            <ArrowLeft size={14} /> Back to Sub Category
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Item Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage items inside selected sub category
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Items</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {items?.length || 0}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Package className="text-purple-400" size={20} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        {isLoading && (
          <p className="text-gray-400">Loading items...</p>
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
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items?.map((item) => (
                <tr
                  key={item.id}
                  className="group border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-6 py-4 text-yellow-400 font-semibold">
                    {item.name}
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
                            setSelectedItem(item)
                            setIsEditOpen(true)
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDelete(item.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && items?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No items found.
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateItemModal
        categoryId={categoryId!}
        subCategoryId={subCategoryId!}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["items", categoryId, subCategoryId],
          })
        }
      />

      {/* EDIT MODAL */}
      <EditItemModal
        categoryId={categoryId!}
        subCategoryId={subCategoryId!}
        isOpen={isEditOpen}
        item={selectedItem}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["items", categoryId, subCategoryId],
          })
        }
      />
    </div>
  )
}

export default ItemPage