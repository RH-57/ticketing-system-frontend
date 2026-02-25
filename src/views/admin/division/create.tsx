// CreateDivisionModal.tsx
import { FC, useState, FormEvent } from "react"
import toast from "react-hot-toast"
import useDivisionCreate, { ErrorResponse, ValidationErrors } from "../../../hooks/division/useDivisionCreate"
import { AxiosError } from "axios"

interface Props {
  branchId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateDivisionModal: FC<Props> = ({ branchId, isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const createDivision = useDivisionCreate(branchId)

  if (!isOpen) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    createDivision.mutate(
      { code, name },
      {
        onSuccess: () => {
          toast.success("Division created successfully")
          setCode("")
          setName("")
          onSuccess?.()
          onClose()
        },
        onError: (err: AxiosError<ErrorResponse>) => {
          setErrors(err?.response?.data?.errors || {})
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-5">Create Division</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
            {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDivisionModal

