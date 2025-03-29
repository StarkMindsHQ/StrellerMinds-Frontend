"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface SavedSnippetsProps {
  snippets: { [key: string]: string }
  onLoad: (name: string) => void
  onDelete: (name: string) => void
}

export default function SavedSnippets({ snippets, onLoad, onDelete }: SavedSnippetsProps) {
  const handleLoad = (name: string) => {
    onLoad(name)
    toast.success(`Loaded code snippet "${name}"`)
  }

  const handleDelete = (name: string) => {
    onDelete(name)
    toast.success(`Code snippet "${name}" has been deleted`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved Code</CardTitle>
        <CardDescription>Load or delete your previously saved code snippets</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(snippets).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No saved snippets yet</div>
        ) : (
          <div className="space-y-2">
            {Object.keys(snippets).map((name) => (
              <div key={name} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium truncate max-w-[150px]">{name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleLoad(name)}>
                    Load
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(name)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

