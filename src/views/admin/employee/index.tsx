import { FC, useEffect, useState } from "react"
import {
  Plus,
  Users,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import useEmployees, {
  Employee,
} from "../../../hooks/employee/useEmployees"
import useDeleteEmployee from "../../../hooks/employee/useEmployeeDelete"
import CreateEmployeeModal from "./create"
import EditEmployeeModal from "./edit"
import ActionDropdown from "../../../components/ActionDropdown"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const EmployeePage: FC = () => {
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)

  const { data, isLoading, isError, error } = useEmployees(page, perPage)

  const employees: Employee[] = data?.data || []
  const meta = data?.meta

  const deleteEmployee = useDeleteEmployee()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null)

  const totalEmployees = meta?.total || 0

  useEffect(() => {
    document.title = "Employee Management - Ticketing System"
  }, [])

  // ===== EDIT =====
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsEditOpen(true)
  }

  // ===== DELETE =====
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    const toastId = toast.loading("Deleting employee...")

    deleteEmployee.mutate(id, {
      onSuccess: () => {
        toast.success("Employee deleted successfully", { id: toastId })
        queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
      onError: () =>
        toast.error("Failed to delete employee", { id: toastId }),
    })
  }

  return (
    <div className="space-y-6">

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
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        {isLoading && (
          <p className="text-gray-400">Loading employees...</p>
        )}

        {isError && (
          <p className="text-red-500">
            {error?.message || "Something went wrong"}
          </p>
        )}

        {!isLoading && !isError && (
          <table className="min-w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <th className="px-6 py-2">Name</th>
                <th className="px-6 py-2">Department</th>
                <th className="px-6 py-2">Division</th>
                <th className="px-6 py-2">Branch</th>
                <th className="px-6 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="group border-b border-gray-800 hover:bg-gray-800/40 transition cursor-pointer"
                >
                  <td className="px-6 py-2 text-yellow-400 font-medium">
                      {employee.name}
                  </td>

                  <td className="px-6 py-2">
                    {employee.department?.name}
                  </td>

                  <td className="px-6 py-2">
                    {employee.division?.name}
                  </td>

                  <td className="px-6 py-2">
                    {employee.branch?.name}
                  </td>

                  <td
                    className="px-6 py-2 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                          onClick: () =>
                            handleDelete(employee.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && employees.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No employees found.
          </div>
        )}

        {/* PAGINATION */}
        {meta && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-400">
              Page {meta.current_page} of {meta.last_page}
            </p>

            <div className="flex gap-2">
              <button
                disabled={meta.current_page === 1}
                onClick={() =>
                  setPage((prev) => Math.max(prev - 1, 1))
                }
                className="px-3 py-1 bg-gray-800 text-yellow-400 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={
                  meta.current_page === meta.last_page
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, meta.last_page)
                  )
                }
                className="px-3 py-1 bg-gray-800 text-yellow-400 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateEmployeeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["employees"] })
        }
      />

      {/* EDIT MODAL */}
      <EditEmployeeModal
        isOpen={isEditOpen}
        employee={selectedEmployee}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["employees"] })
        }
      />
    </div>
  )
}

export default EmployeePage