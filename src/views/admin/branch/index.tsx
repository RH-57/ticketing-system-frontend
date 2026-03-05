import { FC, useState, useEffect } from "react"
import { Plus, Building2, Pencil, Trash2, ArrowLeft } from "lucide-react"
import useBranches, { Branch } from "../../../hooks/branch/useBranches"
import useBranchDelete from "../../../hooks/branch/useBranchDelete"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import ActionDropdown from "../../../components/ActionDropdown"
import CreateBranchModal from "./create"
import EditBranchModal from "./edit"
import { useNavigate } from "react-router"

const BranchPage: FC = () => {
  const { data: branches, isLoading, isError, error } = useBranches()

  const deleteBranch = useBranchDelete()
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Company - Branch Management"
  }, [])

  // ===== DELETE =====
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return

    const toastId = toast.loading("Deleting branch...")

    deleteBranch.mutate(id, {
      onSuccess: () => {
        toast.success("Branch deleted successfully", { id: toastId })
      },
      onError: () => {
        toast.error("Failed to delete branch", { id: toastId })
      },
    })
  }

  

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Branch Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage your company branches
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Add Branch
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Branches</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {branches?.length || 0}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Building2 className="text-yellow-400" size={20} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        {isLoading && <p className="text-gray-400">Loading branches...</p>}

        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <table className="min-w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <th className="px-6 py-2">Code</th>
                <th className="px-6 py-2">Name</th>
                <th className="px-6 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
            {branches?.map((branch) => (
              <tr
                key={branch.id}
                className="group border-b border-gray-800 hover:bg-gray-800/40 transition cursor-pointer"
                onClick={() => navigate(`/admin/branches/${branch.id}`)}
              >
                <td className="px-6 py-1 text-white font-medium">
                  <button
                    onClick={() => navigate(`/admin/branches/${branch.id}`)}
                    className="text-yellow-400 hover:text-yellow-300 hover:underline font-semibold transition"
                  >
                    {branch.code}
                  </button>
                </td>

                <td className="px-6 py-1 text-white font-medium">
                    {branch.name}
                </td>

                <td
                  className="px-6 py-1 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionDropdown
                    items={[
                      {
                        label: "Update",
                        icon: Pencil,
                        onClick: () => {
                          setSelectedBranch(branch)
                          setIsEditOpen(true)
                        },
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        danger: true,
                        onClick: () => handleDelete(branch.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        )}

        {!isLoading && branches?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No branches found.
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateBranchModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["branches"] })
        }
      />

      <EditBranchModal
        isOpen={isEditOpen}
        branch={selectedBranch}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["branches"] })}
        />

    </div>
  )
}

export default BranchPage