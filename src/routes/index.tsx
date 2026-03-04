import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Routes, Route, Navigate } from "react-router-dom"

import Login from "../views/auth/login"
import Layout from "../components/Layout"
import Dashboard from "../views/admin/dashboard"
import UserPage from "../views/admin/user"
import BranchPage from "../views/admin/branch"
import DivisionPage from "../views/admin/division"
import NotFound from "../components/NotFound"
import DepartmentPage from "../views/admin/department"
import EmployeePage from "../views/admin/employee"
import CategoryPage from "../views/admin/category"
import SubCategoryPage from "../views/admin/subCategory"
import ItemPage from "../views/admin/item"

export default function AppRoutes() {
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated ?? false

  return (
    <Routes>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/admin/dashboard" replace />
            : <Login />
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          isAuthenticated
            ? <Layout />
            : <Navigate to="/login" replace />
        }
      >
        {/* Default /admin */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Nested Routes */}
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="users">
          <Route index element={<UserPage />} />
        </Route>
        <Route path="branches">
          <Route index element={<BranchPage />} />
          <Route path=":branchId" element={<DivisionPage />} />
          <Route path=":branchId/divisions/:divisionId" element={<DepartmentPage />} />
        </Route>
        <Route path="employees">
          <Route index element={<EmployeePage />} />
        </Route>
        <Route path="categories">
          <Route index element={<CategoryPage />} />
          <Route path=":categoryId" element={<SubCategoryPage />} />
          <Route path=":categoryId/sub-categories/:subCategoryId" element={<ItemPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}