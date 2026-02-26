import { FC, useState, FormEvent } from "react"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import useCreateEmployee, { ErrorResponse } from "../../../hooks/employee/useEmployeeCreate"
import useAllDepartments, { Department } from "../../../hooks/department/useAllDepartments"

interface ValidationErrors {
  name?: string[]
  division_id?: string
  department_id?: string[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateEmployeeModal: FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("")
  const [departmentId, setDepartmentId] = useState<number | "">("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { data: departments } = useAllDepartments()
  const createEmployee = useCreateEmployee()

  if (!isOpen) return null

  const grouped = departments?.reduce((acc, dept) => {
    const key = dept.division?.name || "No Division"

    if (!acc[key]) acc[key] = []
    acc[key].push(dept)

    return acc
  }, {} as Record<string, Department[]>)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!departmentId) {
      setErrors({ department_id: ["Department is required"] })
      return
    }

    createEmployee.mutate(
      {
        name,
        department_id: departmentId,
      },
      {
        onSuccess: () => {
          toast.success("Employee created successfully")
          setName("")
          setDepartmentId("")
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
          Create Employee
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* NAME */}
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

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm text-gray-400">
              Department
            </label>

            <select
              value={departmentId}
              onChange={(e) =>
                setDepartmentId(e.target.value ? Number(e.target.value) : "")
              }
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select Department</option>

              {grouped &&
                Object.entries(grouped).map(([divisionName, depts]) => (
                  <optgroup key={divisionName} label={divisionName}>
                    {depts.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>

            {errors.division_id && (
              <p className="text-red-400 text-xs mt-1">
                {errors.division_id}
              </p>
            )}
          </div>

          {/* BUTTONS */}
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
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateEmployeeModal