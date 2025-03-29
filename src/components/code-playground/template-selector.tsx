"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (value: string) => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <Select value={selectedTemplate} onValueChange={onTemplateChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="blank">Blank Template</SelectItem>
        <SelectItem value="create-account">Create Account</SelectItem>
        <SelectItem value="check-balance">Check Balance</SelectItem>
        <SelectItem value="send-payment">Send Payment</SelectItem>
        <SelectItem value="create-trustline">Create Trustline</SelectItem>
        <SelectItem value="stellar-test">Stellar SDK Test</SelectItem>
      </SelectContent>
    </Select>
  )
}

