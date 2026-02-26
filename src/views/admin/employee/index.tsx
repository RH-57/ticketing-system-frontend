import { FC, useEffect, useState } from "react"
import { Plus, Users, Pencil, Trash2, Building2, ArrowLeft } from "lucide-react"
import useEmployees, { Employee } from "../../../hooks/employee/useEmployees"
import useDeleteEmployee from "../../../hooks/employee/useEmployeeDelete"
import CreateEmployeeModal from "./create"
import EditEmployeeModal from "./edit"
import ActionDropdown from "../../../components/ActionDropdown"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const EmployeePage: FC = () => {
  const { data: employees, isLoading, isError, error } = useEmployees()
  const deleteEmployee = useDeleteEmployee()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const totalEmployees = employees?.length || 0

  useEffect(() => {
    document.title = "Employee Management - Ticketing System"
  }, [])

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return

    const toastId = toast.loading("Deleting employee...")

    deleteEmployee.mutate(id, {
      onSuccess: () =>
        toast.success("Employee deleted successfully", { id: toastId }),
      onError: () =>
        toast.error("Failed to delete employee", { id: toastId }),
    })
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
            >
            <ArrowLeft size={14} /> Back to Dashboard
            </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Employee Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage employees and their organizational structure
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Employees</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {totalEmployees}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="text-blue-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Branches</p>
            <h2 className="text-2xl font-bold text-white mt-1">
              {new Set(employees?.map(e => e.branch?.name)).size || 0}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Building2 className="text-purple-400" size={20} />
          </div>
        </div>
      </div>

      {/* DATA */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">

        {isLoading && <p className="text-gray-400">Loading employees...</p>}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-800">
                  <tr>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Division</th>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees?.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-800">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">
                          {employee.name}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                          {employee.department?.name}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                          {employee.division?.name}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                          {employee.branch?.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionDropdown
                          items={[
                            {
                              label: "Update",
                              icon: Pencil,
                              onClick: () => handleEdit(employee),
                            },
                            {
                              label: "Delete",
                              icon: Trash2,
                              danger: true,
                              onClick: () => handleDelete(employee.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD LIST */}
            <div className="space-y-3 md:hidden">
              {employees?.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3"
                >
                  <p className="text-white font-semibold">
                    {employee.name}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                      {employee.department?.name}
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                      {employee.division?.name}
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                      {employee.branch?.name}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 text-white py-2 rounded-lg active:scale-95"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 text-white py-2 rounded-lg active:scale-95"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <CreateEmployeeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["employees"] })
        }
      />

      <EditEmployeeModal
        employeeId={editingId}
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["employees"] })
        }
      />
    </div>
  )
}

export default EmployeePage