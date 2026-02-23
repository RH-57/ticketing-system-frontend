import { FC, useState, useEffect, FormEvent } from "react"
import useUserById from "../../../hooks/user/useUserById"
import toast from "react-hot-toast"
import useUserUpdate, { UserUpdateRequest } from "../../../hooks/user/useUserUpdate"

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
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400">Password (leave blank if not changing)</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
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