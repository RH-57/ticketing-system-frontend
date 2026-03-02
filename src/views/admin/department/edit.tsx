import { FC, useState, useEffect, FormEvent } from "react"
import toast from "react-hot-toast"
import useDepartmentUpdate from "../../../hooks/department/useDepartmentUpdate"
import { Department } from "../../../hooks/department/useDepartments"
import { AxiosError } from "axios"
import { AlertCircle } from "lucide-react"

interface Props {
  branchId: string
  divisionId: string
  department: Department | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ValidationErrors {
  name?: string[]
}

interface ErrorResponse {
  errors?: ValidationErrors
}

const EditDepartmentModal: FC<Props> = ({
  branchId,
  divisionId,
  department,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const updateDepartment = useDepartmentUpdate(
    branchId,
    divisionId,
    department ? String(department.id) : ""
  )

  useEffect(() => {
    if (!department) return
    setName(department.name)
    setErrors({})
  }, [department])

  if (!isOpen || !department) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    updateDepartment.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Department updated successfully")
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
        <h2 className="text-xl font-semibold text-white mb-5">
          Edit Department
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
            {errors.name && (
              <div className="mt-2 flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-[2px]" />
                  <span className="text-sm text-red-700 font-medium">
                  {errors.name[0]}
                  </span>
              </div>
            )}
          </div>

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
              className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg py-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDepartmentModal