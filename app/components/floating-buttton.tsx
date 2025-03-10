"use client"

import { Button } from "@nextui-org/react"
import { FaPlus } from "react-icons/fa"

interface FloatingAddButtonProps {
  onClick: () => void
  label?: string
}

export function FloatingAddButton({ onClick, label = "Add Savings" }: FloatingAddButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full z-50 opacity-100"
      aria-label={label}
      color="primary"
      isIconOnly 
    >
      <FaPlus className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  )
}

