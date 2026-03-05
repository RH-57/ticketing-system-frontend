import { FC, useState, FormEvent } from "react"
import { AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import useChangePassword, { ValidationErrors } from "../../../hooks/user/useChangePassword"

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal: FC<Props> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const changePassword = useChangePassword()

  if (!isOpen) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    changePassword.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully")

          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setErrors({})

          onClose()
        },
        onError: (error) => {
          setErrors(error?.response?.data?.errors || {})
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full sm:max-w-md bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">
        <h2 className="text-xl font-semibold text-white mb-5">
          Change Password
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* CURRENT PASSWORD */}
          <div>
            <label className="text-sm text-gray-400">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.current_password
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Current Password"
            />

            {errors.current_password && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.current_password[0]}</span>
              </div>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm text-gray-400">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.new_password
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="New Password"
            />

            {errors.new_password && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.new_password[0]}</span>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-400">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.confirm_password
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Confirm Password"
            />

            {errors.confirm_password && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.confirm_password[0]}</span>
              </div>
            )}
          </div>

          {/* ACTION */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 transition disabled:opacity-50"
            >
              {changePassword.isPending ? "Processing..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal