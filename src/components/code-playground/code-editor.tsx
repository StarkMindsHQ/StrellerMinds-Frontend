"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Copy, Play, Share2, RefreshCw, Square } from "lucide-react"
import { toast } from "sonner"
import { executeCode } from "@/lib/code-executor"
import { simpleTestCode } from "@/lib/simple-test-code"


interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
  isExecuting: boolean
  setIsExecuting: (isExecuting: boolean) => void
  setOutput: React.Dispatch<React.SetStateAction<string>>
}

export default function CodeEditor({ code, setCode, isExecuting, setIsExecuting, setOutput }: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [showTestButton, setShowTestButton] = useState(true)
  const stopExecutionRef = useRef<(() => void) | null>(null)
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleExecuteCode = async () => {
    setIsExecuting(true)
    setOutput("")

    let currentOutput = ""

    try {
      const { stop } = await executeCode(code, (log: string) => {
        currentOutput += log + "\n"
        setOutput(currentOutput)
      })

      // Store the stop function for later use
      stopExecutionRef.current = stop

      // Set a safety timeout to ensure UI doesn't get stuck
      executionTimeoutRef.current = setTimeout(() => {
        if (isExecuting) {
          setOutput((prev) => prev + "\n--- Execution timed out after 60 seconds ---")
          handleStopExecution()
        }
      }, 60000) // 60 second safety timeout
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Execution error: ${error.message}`)
      } else {
        setOutput(`Execution error: ${String(error)}`)
      }
      setIsExecuting(false)
    }
  }

  const handleStopExecution = () => {
    if (stopExecutionRef.current) {
      stopExecutionRef.current()
      stopExecutionRef.current = null
    }

    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current)
      executionTimeoutRef.current = null
    }

    setIsExecuting(false)
    setOutput((prev) => prev + "\n--- Execution stopped by user ---")
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stopExecutionRef.current) {
        stopExecutionRef.current()
      }
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current)
      }
    }
  }, [])

  const runSimpleTest = () => {
    setCode(simpleTestCode)
    toast.success("Simple test code loaded. Click 'Run Code' to execute.")
    setShowTestButton(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard")
  }

  const shareCode = () => {
    // Create a shareable URL with the code encoded in the query parameter
    const encodedCode = encodeURIComponent(code)
    const url = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`

    navigator.clipboard.writeText(url)
    toast.success("Share link copied to clipboard")
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden h-[500px]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => {
            setCode(value || "")
            if (!showTestButton) setShowTestButton(true)
          }}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </div>
      <div className="flex  gap-2 flex-wrap">
     
          {isExecuting ? (
            <Button onClick={handleStopExecution} variant="destructive" className="gap-2">
              <Square className="h-4 w-4" />
              Stop Execution
            </Button>
          ) : (
            <Button onClick={handleExecuteCode} className="gap-2">
              <Play className="h-4 w-4" />
              Run Code
            </Button>
          )}
          {showTestButton && (
            <Button variant="outline" onClick={runSimpleTest} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Load Test Code
            </Button>
          )}
          <Button variant="outline" onClick={copyCode} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
       
          <Button variant="outline" onClick={shareCode} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
    
    </div>
  )
}

