import { FC, useEffect, useState } from "react"
import { Plus, Users, UserCheck, Pencil, Trash2 } from "lucide-react"
import useUsers, { User as IUser } from "../../../hooks/user/useUsers"
import useUserDelete from "../../../hooks/user/useUserDelete"
import CreateUserModal from "./create"
import ActionDropdown from "../../../components/ActionDropdown"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import EditUserModal from "./edit"

const UserPage: FC = () => {
  const { data: users, isLoading, isError, error } = useUsers()
  const queryClient = useQueryClient()
  const deleteUser = useUserDelete()

  const [open, setOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)

  const totalUsers = users?.length || 0
  const activeUsers = users?.filter((user: IUser) => user.is_active).length || 0

  useEffect(() => {
    document.title = "User Management - Ticketing System"
  }, [])

  const handleUpdate = (user: IUser) => {
    setEditingUserId(user.id)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return

    const toastId = toast.loading("Deleting user...")

    deleteUser.mutate(id, {
      onSuccess: () => toast.success("User deleted successfully", { id: toastId }),
      onError: () => toast.error("Failed to delete user", { id: toastId }),
    })
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage your team members and their account permissions
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Users</p>
            <h2 className="text-2xl font-bold text-white mt-1">{totalUsers}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="text-blue-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Active</p>
            <h2 className="text-2xl font-bold text-white mt-1">{activeUsers}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <UserCheck className="text-green-400" size={20} />
          </div>
        </div>
      </div>

      {/* DATA */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">

        {isLoading && <p className="text-gray-400">Loading users...</p>}
        {isError && <p className="text-red-500">{error?.message || "Something went wrong"}</p>}

        {!isLoading && !isError && (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-800">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: IUser) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionDropdown
                          items={[
                            { label: "Update", icon: Pencil, onClick: () => handleUpdate(user) },
                            { label: "Delete", icon: Trash2, danger: true, onClick: () => handleDelete(user.id) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD LIST */}
            <div className="space-y-3 md:hidden">
              {users?.map((user: IUser) => (
                <div key={user.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-xs break-all">{user.email}</p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                    {user.role}
                  </span>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleUpdate(user)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 py-2 rounded-lg active:scale-95"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 text-red-400 py-2 rounded-lg active:scale-95"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <CreateUserModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />

      <EditUserModal
        userId={editingUserId}
        isOpen={editingUserId !== null}
        onClose={() => setEditingUserId(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />
    </div>
  )
}

export default UserPage