import { FC, useState, useEffect, FormEvent } from "react"
import useUserById from "../../../hooks/user/useUserById"
import useUserUpdate from "../../../hooks/user/useUserUpdate"

interface Props {
  userId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ValidationErrors {
  [key: string]: string
}

const EditUserModal: FC<Props> = ({
  userId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data, isLoading } = useUserById(userId, isOpen)
  const updateUser = useUserUpdate()

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<ValidationErrors>({})

  // ===== PREFILL DATA SAAT MODAL TERBUKA =====
  useEffect(() => {
    if (isOpen && data) {
      setName(data.name)
      setUsername(data.username)
      setEmail(data.email)
      setRole(data.role)
      setIsActive(data.is_active)
    }
  }, [data, isOpen])

  // ===== RESET STATE SAAT MODAL DITUTUP =====
  useEffect(() => {
    if (!isOpen) {
      setName("")
      setUsername("")
      setEmail("")
      setPassword("")
      setRole("user")
      setIsActive(true)
      setErrors({})
    }
  }, [isOpen])

  // ===== SUBMIT UPDATE =====
  const updateHandler = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!userId) return

    updateUser.mutate(
      {
        id: userId,
        name,
        username,
        email,
        role,
        is_active: isActive,
        ...(password && { password }),
      },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
        onError: (error) => {
          setErrors(error?.response?.data?.errors || {})
        },
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">

        <h2 className="text-xl font-semibold text-white mb-5">
          Edit User
        </h2>

        {isLoading ? (
          <p className="text-gray-400">Loading user...</p>
        ) : (
          <form onSubmit={updateHandler} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-400">
                Password (leave blank if not changing)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm text-gray-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            {/* STATUS TOGGLE */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Status
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    isActive ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${
                      isActive ? "translate-x-7" : ""
                    }`}
                  />
                </button>

                <span className="text-sm text-gray-300">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
        )}
      </div>
    </div>
  )
}

export default EditUserModal