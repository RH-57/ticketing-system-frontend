import { FC, useEffect, useState, FormEvent } from "react"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import useUpdateEmployee from "../../../hooks/employee/useEmployeeUpdate"
import useEmployees from "../../../hooks/employee/useEmployees"
import useAllDepartments from "../../../hooks/department/useAllDepartments"

interface ValidationErrors {
  name?: string
  department_id?: string
}

interface ErrorResponse {
  success: boolean
  message: string
  errors?: ValidationErrors
}

interface Props {
  employeeId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const EditEmployeeModal: FC<Props> = ({
  employeeId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: employees } = useEmployees()
  const { data: departments } = useAllDepartments()
  const updateEmployee = useUpdateEmployee()

  const employee = employees?.find((e) => e.id === employeeId)

  const [name, setName] = useState("")
  const [departmentId, setDepartmentId] = useState<number | "">("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  useEffect(() => {
    if (employee) {
      setName(employee.name)
      setDepartmentId(employee.department?.id || "")
    }
  }, [employee])

  if (!isOpen || !employee) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    updateEmployee.mutate(
      {
        id: employee.id,
        name,
        department_id: Number(departmentId),
      },
      {
        onSuccess: () => {
          toast.success("Employee updated successfully")
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
        <h2 className="text-xl font-semibold text-white mb-5">
          Edit Employee
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-400">Employee Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select Department</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <p className="text-red-400 text-xs mt-1">
                {errors.department_id}
              </p>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEmployeeModal