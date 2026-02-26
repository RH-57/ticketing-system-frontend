import { FC, FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import useCategoryCreate, {
  ErrorResponse,
  ValidationErrors,
} from "../../../hooks/category/useCategoryCreate"
import { AlertCircle } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateCategoryModal: FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { mutate, isPending } = useCategoryCreate()

  if (!isOpen) return null

  const storeCategory = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Category created successfully")
          setName("")
          onSuccess?.()
          onClose()
        },
        onError: (err: AxiosError<ErrorResponse>) => {
          setErrors(err.response?.data?.errors ?? {})
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
          Add Category
        </h2>

        <form onSubmit={storeCategory} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Example: Laptop"
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
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg py-2 transition disabled:opacity-50"
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