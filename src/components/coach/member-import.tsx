'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
} from 'lucide-react'

interface Coach {
  id: string
  name_en: string
  name_ar?: string
}

interface ImportResult {
  success: boolean
  totalRows: number
  imported: number
  failed: number
  errors: Array<{ row: number; error: string; data?: Record<string, unknown> }>
}

interface MemberImportProps {
  coaches: Coach[]
}

export function MemberImport({ coaches }: MemberImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [selectedCoach, setSelectedCoach] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ]
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const hasValidExtension = validExtensions.some(ext =>
        selectedFile.name.toLowerCase().endsWith(ext)
      )

      if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
        alert('Please select an Excel (.xlsx, .xls) or CSV file')
        return
      }

      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (selectedCoach) {
        formData.append('coach_id', selectedCoach)
      }

      const response = await fetch('/api/members/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success && data.imported > 0) {
        // Refresh the page after successful import
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        totalRows: 0,
        imported: 0,
        failed: 0,
        errors: [{ row: 0, error: error instanceof Error ? error.message : 'Upload failed' }],
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Create a sample CSV template
    const template = `name_en,name_ar,email,phone,whatsapp_number,membership_type,start_date,end_date,pt_sessions
John Doe,جون دو,john@example.com,+962791234567,+962791234567,monthly,2024-01-01,2024-02-01,0
Jane Smith,جين سميث,jane@example.com,+962791234568,+962791234568,quarterly,2024-01-01,2024-04-01,10
Ahmad Ali,أحمد علي,ahmad@example.com,+962791234569,+962791234569,yearly,2024-01-01,2025-01-01,20`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'members_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setSelectedCoach('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Members from Excel/CSV</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to bulk import members. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          {/* Coach Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Coach (Optional)</label>
            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger>
                <SelectValue placeholder="Select a coach to assign to all members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No coach assigned</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select File</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Members
              </>
            )}
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-3">
              {result.success && result.imported > 0 ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Import Successful!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Successfully imported {result.imported} of {result.totalRows} members.
                    Page will refresh shortly...
                  </AlertDescription>
                </Alert>
              ) : result.imported > 0 ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Partial Import</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Imported {result.imported} of {result.totalRows} members.
                    {result.failed} failed.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Import Failed</AlertTitle>
                  <AlertDescription>
                    No members were imported. Check the errors below.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error List */}
              {result.errors.length > 0 && (
                <div className="border rounded-lg">
                  <div className="p-3 bg-muted font-medium text-sm">
                    Errors ({result.errors.length})
                  </div>
                  <ScrollArea className="h-40">
                    <div className="p-3 space-y-2">
                      {result.errors.map((error, index) => (
                        <div key={index} className="text-sm flex gap-2">
                          <span className="text-muted-foreground">Row {error.row}:</span>
                          <span className="text-red-600">{error.error}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
            <p className="font-medium">Required columns:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><code>name_en</code> - Name in English (required)</li>
              <li><code>email</code> - Email address (required, must be unique)</li>
            </ul>
            <p className="font-medium mt-2">Optional columns:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><code>name_ar</code> - Name in Arabic</li>
              <li><code>phone</code> / <code>whatsapp_number</code> - Phone numbers</li>
              <li><code>membership_type</code> - monthly, quarterly, or yearly</li>
              <li><code>start_date</code> / <code>end_date</code> - Membership dates (YYYY-MM-DD)</li>
              <li><code>pt_sessions</code> - Number of PT sessions</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
