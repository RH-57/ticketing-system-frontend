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
          onClose()
        },
        onError: (err) => {
          if (err.response?.data?.errors) {
            setErrors(err.response.data.errors)
          } else {
            toast.error(err.response?.data?.message || "Something went wrong")
          }
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Change Password
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* Current */}
          <InputField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            error={errors.current_password?.[0]}
          />

          {/* New */}
          <InputField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            error={errors.new_password?.[0]}
          />

          {/* Confirm */}
          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirm_password?.[0]}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2"
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


interface InputProps {
  label: string
  value: string
  onChange: (val: string) => void
  error?: string
}

const InputField: FC<InputProps> = ({ label, value, onChange, error }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`mt-1 w-full bg-gray-800 border ${
        error ? "border-red-500" : "border-gray-700"
      } rounded-lg px-3 py-2 text-white`}
    />

    {error && (
      <div className="mt-2 flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2">
        <AlertCircle className="h-4 w-4 text-red-500 mt-[2px]" />
        <span className="text-sm text-red-700 font-medium">
          {error}
        </span>
      </div>
    )}
  </div>
)