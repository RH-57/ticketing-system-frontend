import { FC, useEffect, useRef, useState } from "react"
import { MoreVertical, LucideIcon } from "lucide-react"

interface DropdownItem {
  label: string
  onClick: () => void
  danger?: boolean
  icon?: LucideIcon
}

interface Props {
  items: DropdownItem[]
  iconSize?: number
}

const ActionDropdown: FC<Props> = ({ items, iconSize = 18 }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-700 transition"
      >
        <MoreVertical size={iconSize} />
      </button>

      {open && (
        <div className="absolute top-0 right-full ml-2 w-30 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition hover:bg-gray-700 ${
                  item.danger
                    ? "text-red-400 hover:bg-red-600 hover:text-white"
                    : "text-white"
                }`}
              >
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActionDropdown