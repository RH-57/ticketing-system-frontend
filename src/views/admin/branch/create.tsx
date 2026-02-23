import { FC, useState, FormEvent } from "react"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import useBranchCreate from "../../../hooks/branch/useBranchCreate"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ValidationErrors {
  code?: string[]
  name?: string[]
}

interface ErrorResponse {
  errors?: ValidationErrors
}

const CreateBranchModal: FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // ===== STATE =====
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { mutate, isPending } = useBranchCreate()

  // ===== SUBMIT =====
  const storeBranch = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    mutate(
      {
        code,
        name,
      },
      {
        onSuccess: () => {
          toast.success("Branch created successfully")
          onSuccess?.()
          onClose()

          // reset form
          setCode("")
          setName("")
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          setErrors(error.response?.data?.errors || {})
        },
      }
    )
  }

  if (!isOpen) return null

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
          Add Branch
        </h2>

        <form onSubmit={storeBranch} className="space-y-4">
          {/* CODE */}
          <div>
            <label className="text-sm text-gray-400">Branch Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Example: JKT01"
            />
            {errors.code && (
              <p className="text-red-400 text-xs mt-1">
                {errors.code[0]}
              </p>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400">Branch Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Branch Name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name[0]}
              </p>
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
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBranchModal