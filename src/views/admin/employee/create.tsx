import { FC, useState, FormEvent } from "react"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { AlertCircle } from "lucide-react"
import useEmployeeCreate, {
  ValidationErrors,
} from "../../../hooks/employee/useEmployeeCreate"
import useAllDepartments, {
  Department,
} from "../../../hooks/department/useAllDepartments"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ErrorResponse {
  errors?: ValidationErrors
}

const CreateEmployeeModal: FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: departments } = useAllDepartments()
  const { mutate, isPending } = useEmployeeCreate()

  const [name, setName] = useState("")
  const [departmentId, setDepartmentId] = useState<number | "">("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  if (!isOpen) return null

  // ===== GROUP BY DIVISION =====
  const grouped = departments?.reduce((acc, dept) => {
    const key = dept.division?.name || "No Division"
    if (!acc[key]) acc[key] = []
    acc[key].push(dept)
    return acc
  }, {} as Record<string, Department[]>)

  // ===== SUBMIT =====
  const storeEmployee = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!departmentId) {
      setErrors({ department_id: ["Department is required"] })
      return
    }

    mutate(
      {
        name,
        department_id: Number(departmentId),
      },
      {
        onSuccess: () => {
          toast.success("Employee created successfully")

          setName("")
          setDepartmentId("")
          setErrors({})

          onSuccess?.()
          onClose()
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          setErrors(error.response?.data?.errors || {})
        },
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
      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">

        <h2 className="text-xl font-semibold text-white mb-5">
          Create Employee
        </h2>

        <form onSubmit={storeEmployee} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400">
              Employee Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }))
                }
              }}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.name
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Employee Name"
            />

            {errors.name && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.name[0]}</span>
              </div>
            )}
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm text-gray-400">
              Department
            </label>

            <select
              value={departmentId}
              onChange={(e) => {
                const value = e.target.value
                setDepartmentId(value ? Number(value) : "")

                if (errors.department_id) {
                  setErrors(prev => ({
                    ...prev,
                    department_id: undefined,
                  }))
                }
              }}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.department_id
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
            >
              <option value="">Select Department</option>

              {grouped &&
                Object.entries(grouped).map(
                  ([divisionName, depts]) => (
                    <optgroup
                      key={divisionName}
                      label={divisionName}
                    >
                      {depts.map((dept) => (
                        <option
                          key={dept.id}
                          value={dept.id}
                        >
                          {dept.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
            </select>

            {errors.department_id && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.department_id[0]}</span>
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
              {isPending ? "Saving..." : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateEmployeeModal