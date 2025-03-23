"use client"
import { useState } from "react";
import { ValidatedInput } from "./ui/input";

export default function Card () {

const [formData, setFormData] = useState({
    email: "",
    username: "",
  })

  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address"
    return null
  }

  const validateUsername = (value: string) => {
    if (!value) return "Username is required"
    if (value.length < 3) return "Username must be at least 3 characters"
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Form submitted with: ${JSON.stringify(formData, null, 2)}`)
  }

    return (


<ValidatedInput 
        id="email"
        label="Email Address"
        placeholder="your@email.com"
        type="email"
        required
        validate={validateEmail}
        onChange={(value) => setFormData((prev) => ({ ...prev, email: value 
    })
    )} 
    />
   )
}