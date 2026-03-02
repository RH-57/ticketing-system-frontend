import { FC, FormEvent, useState } from "react"
import toast from "react-hot-toast"
import useCategoryCreate, { ValidationErrors } from "../../../hooks/category/useCategoryCreate"
import { AlertCircle } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateCategoryModal: FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { mutate, isPending } = useCategoryCreate()

  if (!isOpen) return null

  // ===== SUBMIT =====
  const storeCategory = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Category created successfully")

          // reset form
          setName("")
          setErrors({})

          onSuccess?.()
          onClose()
        },
        onError: (error) => {
          setErrors(error?.response?.data?.errors || {})
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* ===== OVERLAY ===== */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ===== MODAL ===== */}
      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">

        <h2 className="text-xl font-semibold text-white mb-5">
          Add Category
        </h2>

        <form onSubmit={storeCategory} className="space-y-4">

          {/* ===== NAME ===== */}
          <div>
            <label className="text-sm text-gray-400">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full bg-gray-800 rounded-lg px-3 py-2 text-white outline-none transition
                ${
                  errors.name
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border border-gray-700 focus:ring-2 focus:ring-blue-600"
                }`}
              placeholder="Example: Laptop"
            />

            {errors.name && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.name[0]}</span>
              </div>
            )}
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg py-2 transition disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateCategoryModal