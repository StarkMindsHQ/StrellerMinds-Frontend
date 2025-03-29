"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "sonner"
import { codeTemplates } from "@/lib/code-templates"
import TemplateSelector from "@/components/code-playground/template-selector"
import CodeEditor from "@/components/code-playground/code-editor"
import OutputPanel from "@/components/code-playground/output-panel"

import SaveCodeForm from "@/components/code-playground/save-code-form"
import DocumentationPanel from "@/components/code-playground/documentation-panel"
import SavedSnippets from "@/components/code-playground/saved-snippets"


export default function StellarPlayground() {
  const [code, setCode] = useState(codeTemplates["blank"])
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("blank")
  const [savedSnippets, setSavedSnippets] = useState<{ [key: string]: string }>({})

  // Load saved snippets from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("stellar-playground-snippets")
    if (saved) {
      setSavedSnippets(JSON.parse(saved))
    }
  }, [])

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    setCode(codeTemplates[value as keyof typeof codeTemplates])
  }

  const saveSnippet = (name: string, code: string) => {
    const updatedSnippets = {
      ...savedSnippets,
      [name]: code,
    }

    setSavedSnippets(updatedSnippets)
    localStorage.setItem("stellar-playground-snippets", JSON.stringify(updatedSnippets))
  }

  const loadSnippet = (name: string) => {
    setCode(savedSnippets[name])
  }

  const deleteSnippet = (name: string) => {
    const { [name]: _, ...rest } = savedSnippets
    setSavedSnippets(rest)
    localStorage.setItem("stellar-playground-snippets", JSON.stringify(rest))
  }

  // Check for shared code in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedCode = params.get("code")

    if (sharedCode) {
      setCode(decodeURIComponent(sharedCode))
      setSelectedTemplate("blank")
    }
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Toaster position="top-right" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Stellar Blockchain Playground</CardTitle>
          <CardDescription>Write, run, and test Stellar blockchain code directly in your browser</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Code Editor</CardTitle>
                <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={handleTemplateChange} />
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                code={code}
                setCode={setCode}
                isExecuting={isExecuting}
                setIsExecuting={setIsExecuting}
                setOutput={setOutput}
              />
            </CardContent>
          </Card>

          <OutputPanel output={output} />
        </div>

        <div>
          <Tabs defaultValue="saved">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved">Saved Snippets</TabsTrigger>
              <TabsTrigger value="save">Save Code</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <SavedSnippets snippets={savedSnippets} onLoad={loadSnippet} onDelete={deleteSnippet} />
            </TabsContent>
            <TabsContent value="save">
              <SaveCodeForm code={code} onSave={saveSnippet} />
            </TabsContent>
          </Tabs>

          <DocumentationPanel/>
        </div>
      </div>
    </div>
  )
}

