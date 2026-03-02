import { FC, useState, useEffect, FormEvent } from "react"
import useUserById from "../../../hooks/user/useUserById"
import toast from "react-hot-toast"
import useUserUpdate, { UserUpdateRequest } from "../../../hooks/user/useUserUpdate"
import { AlertCircle } from "lucide-react"

interface Props {
  userId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ValidationErrors {
  name?: string
  username?: string
  email?: string
  password?: string
  role?: string
}

type Role = "user" | "admin" | "technician"

const EditUserModal: FC<Props> = ({ userId, isOpen, onClose, onSuccess }) => {

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("user")
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const updateUser = useUserUpdate()

  const { data, isLoading, dataUpdatedAt } = useUserById(userId, isOpen)

  // 🔥 PREFILL VIA REACT QUERY SUCCESS
  useEffect(() => {
    if (!isOpen || !data) return

    setName(data.name)
    setUsername(data.username)
    setEmail(data.email)
    setRole(data.role as Role)
    setIsActive(data.is_active)
    setPassword("")
    setErrors({})

  }, [dataUpdatedAt, isOpen])

  // Reset ringan saat close
  useEffect(() => {
    if (!isOpen) {
      setPassword("")
      setErrors({})
    }
  }, [isOpen])

  const updateHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!userId) return

    const payload: UserUpdateRequest = {
      id: userId,
      name,
      username,
      email,
      role,
      is_active: isActive,
      ...(password && { password }),
    }

    updateUser.mutate(payload, {
      onSuccess: () => {
        toast.success("User updated successfully")
        onSuccess?.()
        onClose()
      },
      onError: (error: unknown) => {
        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as {
            response?: { data?: { errors?: ValidationErrors } }
          }
          setErrors(err.response?.data?.errors || {})
        }
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">
        <h2 className="text-xl font-semibold text-white mb-5">Edit User</h2>

        {isLoading ? (
          <p className="text-gray-400">Loading user...</p>
        ) : (
          <form onSubmit={updateHandler} className="space-y-4">

            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input 
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.name
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
                placeholder="Full Name"
                />
              {errors.name && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.name[0]}</span>
              </div>
            )}
            </div>

            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input 
                value={username} 
                onChange={(e)=>setUsername(e.target.value)} 
                className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.username
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
                placeholder="Username"
              />
              {errors.username && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.username[0]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.email
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.email[0]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400">Password (leave blank if not changing)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.password
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.password[0]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400">Role</label>
              <select value={role} onChange={(e)=>setRole(e.target.value as Role)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Status</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={()=>setIsActive(!isActive)} className={`relative w-14 h-7 rounded-full transition ${isActive?"bg-green-500":"bg-gray-600"}`}>
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${isActive?"translate-x-7":""}`}/>
                </button>
                <span className="text-sm text-gray-300">{isActive?"Active":"Inactive"}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2">Cancel</button>
              <button type="submit" disabled={updateUser.isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 disabled:opacity-50">
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