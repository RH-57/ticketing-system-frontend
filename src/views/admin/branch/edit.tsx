import { FC, useState, useEffect, FormEvent } from "react"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import useBranchUpdate from "../../../hooks/branch/useBranchUpdate"
import { ValidationErrors } from "../../../hooks/branch/useBranchUpdate"
import { AlertCircle } from "lucide-react"

interface Branch {
  id: number
  code: string
  name: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  branch: Branch | null
  onSuccess?: () => void
}

interface ErrorResponse {
  errors?: ValidationErrors
}

const EditBranchModal: FC<Props> = ({
  isOpen,
  onClose,
  branch,
  onSuccess,
}) => {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { mutate, isPending } = useBranchUpdate()

  // 🔥 Prefill ketika branch berubah / modal dibuka
  useEffect(() => {
    if (branch && isOpen) {
      setCode(branch.code)
      setName(branch.name)
    }
  }, [branch, isOpen])

  const updateBranch = (e: FormEvent) => {
    e.preventDefault()
    if (!branch) return

    setErrors({})

    mutate(
      {
        id: branch.id,
        code,
        name,
      },
      {
        onSuccess: () => {
          toast.success("Branch updated successfully")
          onSuccess?.()
          onClose()
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          setErrors(error.response?.data?.errors || {})
        },
      }
    )
  }

  if (!isOpen || !branch) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">
        <h2 className="text-xl font-semibold text-white mb-5">
          Edit Branch
        </h2>

        <form onSubmit={updateBranch} className="space-y-4">
          {/* CODE */}
          <div>
            <label className="text-sm text-gray-400">Branch Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.code
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Branch Code"
            />
            {errors.code && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.code[0]}</span>
              </div>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400">Branch Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.name
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Branch Name"
            />
            {errors.name && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.name[0]}</span>
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
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 transition disabled:opacity-50"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBranchModal