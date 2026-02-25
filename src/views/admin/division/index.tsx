import { FC, useEffect, useState } from "react"
import { Plus, Building2, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import useDivisions, { Division } from "../../../hooks/division/useDivisions"
import useDivisionDelete from "../../../hooks/division/useDivisionDelete"

import ActionDropdown from "../../../components/ActionDropdown"
import CreateDivisionModal from "./create"
import EditDivisionModal from "./edit"

const DivisionPage: FC = () => {
  const { branchId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: divisions, isLoading, isError, error } = useDivisions(branchId!)
  const deleteDivision = useDivisionDelete(branchId!)

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null)

  useEffect(() => {
    document.title = "Company - Division Management"
  }, [])

  // ===== DELETE =====
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this division?")) return

    const toastId = toast.loading("Deleting division...")

    deleteDivision.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["divisions", branchId] })
        toast.success("Division deleted successfully", { id: toastId })
      },
      onError: () => {
        toast.error("Failed to delete division", { id: toastId })
      },
    })
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/branches")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
          >
            <ArrowLeft size={14} /> Back to Branch
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Division Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage divisions inside selected branch
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Add Division
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Divisions</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {divisions?.length || 0}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Building2 className="text-blue-400" size={20} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        {isLoading && <p className="text-gray-400">Loading divisions...</p>}

        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <table className="min-w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {divisions?.map((division) => (
                <tr
                  key={division.id}
                  className="group border-b border-gray-800 hover:bg-gray-800/40 transition cursor-pointer"
                  onClick={() => navigate(`/admin/branches/${branchId}/divisions/${division.id}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-yellow-400 hover:text-yellow-300 hover:underline font-semibold transition">
                      {division.code}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-white font-medium">
                    {division.name}
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
                            setSelectedDivision(division)
                            setIsEditOpen(true)
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDelete(division.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && divisions?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No divisions found.
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateDivisionModal
        branchId={branchId!}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["divisions", branchId] })
        }
      />

      {/* EDIT MODAL */}
      <EditDivisionModal
        branchId={branchId!}
        isOpen={isEditOpen}
        division={selectedDivision}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["divisions", branchId] })
        }
      />

    </div>
  )
}

export default DivisionPage