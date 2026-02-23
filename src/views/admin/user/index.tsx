import { FC, useEffect, useState } from "react"
import { Plus, Users, UserCheck, Pencil, Trash2 } from "lucide-react"
import useUsers, { User as IUser } from "../../../hooks/user/useUsers"
import useUserUpdate from "../../../hooks/user/useUserUpdate"
import useUserDelete from "../../../hooks/user/useUserDelete"
import CreateUserModal from "./create"
import ActionDropdown from "../../../components/ActionDropdown"
import { useQueryClient } from "@tanstack/react-query"
import type { UserUpdateRequest } from "../../../hooks/user/useUserUpdate"
import toast from "react-hot-toast"

const UserPage: FC = () => {
  const { data: users, isLoading, isError, error } = useUsers()
  const queryClient = useQueryClient()
  const updateUser = useUserUpdate()
  const deleteUser = useUserDelete()

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [password, setPassword] = useState("")

  const totalUsers = users?.length || 0
  const activeUsers =
    users?.filter((user: IUser) => user.is_active).length || 0

  useEffect(() => {
    document.title = "User Management - Ticketing System"
  }, [])

  // ===== UPDATE HANDLER =====
  const handleUpdate = (user: IUser) => {
    setSelectedUser(user)
    setPassword("")
    setIsEditOpen(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return

    const toastId = toast.loading("Deleting user...")

    deleteUser.mutate(id, {
      onSuccess: () => {
        toast.success("User deleted successfully", { id: toastId })
      },
      onError: () => {
        toast.error("Failed to delete user", { id: toastId })
      },
    })
  }

  // ===== EDIT SUBMIT =====
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const payload: UserUpdateRequest = {
      id: selectedUser.id,
      name: selectedUser.name,
      username: selectedUser.username,
      email: selectedUser.email,
      role: selectedUser.role,
      is_active: selectedUser.is_active,
    }

    if (password.trim() !== "") {
      payload.password = password
    }

    updateUser.mutate(payload, {
      onSuccess: () => {
        toast.success("User updated successfully")

        setIsEditOpen(false)
        setSelectedUser(null)
        setPassword("")
        queryClient.invalidateQueries({ queryKey: ["users"] })
      },
      onError: () => {
        toast.error("Failed to update user")
      },
    })
  }


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            User Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage your team members and their account permissions
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
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
            <h2 className="text-2xl font-bold text-white mt-1">
              {totalUsers}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="text-blue-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Active</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {activeUsers}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <UserCheck className="text-green-400" size={20} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        {isLoading && <p className="text-gray-400">Loading users...</p>}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
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
                        {
                          label: "Update",
                          icon: Pencil,
                          onClick: () => handleUpdate(user),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDelete(user.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateUserModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["users"] })
        }
      />

      {/* EDIT MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditOpen(false)}
          />

          {/* modal */}
          <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">

            <h2 className="text-xl font-semibold text-white mb-5">
              Edit User
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, username: e.target.value })
                  }
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* PASSWORD (OPTIONAL) */}
              <div>
                <label className="text-sm text-gray-400">
                  Password (leave blank if not changed)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="New Password"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              {/* IS ACTIVE */}
              <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <span className="text-sm text-gray-300">Active Status</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUser({
                      ...selectedUser,
                      is_active: !selectedUser.is_active,
                    })
                  }
                  className={`px-4 py-1 rounded-full text-xs transition ${
                    selectedUser.is_active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedUser.is_active ? "Active" : "Inactive"}
                </button>
              </div>

              {/* ACTION */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 transition disabled:opacity-50"
                >
                  {updateUser.isPending ? "Updating..." : "Update"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPage