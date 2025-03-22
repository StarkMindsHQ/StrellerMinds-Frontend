"use client"

import { useState, type ChangeEvent } from "react"
import { cn } from "@/lib/utils"

export interface ValidatedInputProps {
  id: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
  validate?: (value: string) => string | null
  defaultValue?: string
  onChange?: (value: string) => void
}

export function ValidatedInput({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  className,
  validate,
  defaultValue = "",
  onChange,
}: ValidatedInputProps) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (touched && validate) {
      const validationError = validate(newValue)
      setError(validationError)
    }

    if (onChange) {
      onChange(newValue)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    if (validate) {
      const validationError = validate(value)
      setError(validationError)
    }
  }

  return (
    <div className="space-y-2">
      {/* <Label htmlFor={id} className="font-medium"> */}
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      {/* </Label> */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(error ? "border-destructive focus-visible:ring-destructive" : "", className)}
        required={required}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}