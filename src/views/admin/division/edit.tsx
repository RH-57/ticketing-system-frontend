// EditDivisionModal.tsx
import { FC, useState, useEffect, FormEvent } from "react"
import toast from "react-hot-toast"
import useDivisionUpdate from "../../../hooks/division/useDivisionUpdate"
import { Division } from "../../../hooks/division/useDivisions"
import { AxiosError } from "axios"

interface Props {
  branchId: string
  division: Division | null
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

const EditDivisionModal: FC<Props> = ({ branchId, division, isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const updateDivision = useDivisionUpdate(branchId)

  useEffect(() => {
    if (!division) return
    setCode(division.code)
    setName(division.name)
    setErrors({})
  }, [division])

  if (!isOpen || !division) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    updateDivision.mutate(
      { id: division.id, code, name },
      {
        onSuccess: () => {
          toast.success("Division updated successfully")
          onSuccess?.()
          onClose()
        },
        onError: (err: AxiosError<ErrorResponse>) => {
            setErrors(err.response?.data?.errors || {})
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-5">Edit Division</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Code</label>
            <input value={code} onChange={(e)=>setCode(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
            {errors.code && (
              <p className="text-red-400 text-xs mt-1">
                {errors.code[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2">Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDivisionModal
