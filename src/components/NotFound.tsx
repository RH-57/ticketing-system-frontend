import { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const NotFound: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "404 - Page Not Found"
  }, [])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-7xl font-bold text-yellow-500">404</h1>
      <p className="text-2xl font-semibold text-white mt-4">
        Page Not Found
      </p>
      <p className="text-gray-400 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mt-6 flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg transition"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
    </div>
  )
}

export default NotFound