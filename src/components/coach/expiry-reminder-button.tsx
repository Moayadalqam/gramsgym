'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Send,
  Users,
  Calendar,
} from 'lucide-react'

interface ExpiringMember {
  id: string
  name_en: string
  name_ar: string | null
  email: string
  whatsapp_number: string | null
  phone: string | null
  membership_type: string
  end_date: string
  days_left: number
  has_whatsapp: boolean
}

interface ReminderResult {
  success: boolean
  totalMembers: number
  sent: number
  failed: number
  results: Array<{
    memberId: string
    memberName: string
    status: 'sent' | 'failed' | 'no_whatsapp'
    error?: string
    daysLeft: number
  }>
}

export function ExpiryReminderButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [daysThreshold, setDaysThreshold] = useState('7')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [expiringMembers, setExpiringMembers] = useState<ExpiringMember[]>([])
  const [sendResult, setSendResult] = useState<ReminderResult | null>(null)

  const fetchExpiringMembers = async () => {
    setIsLoading(true)
    setSendResult(null)

    try {
      const response = await fetch(`/api/members/send-expiry-reminders?days=${daysThreshold}`)
      const data = await response.json()
      setExpiringMembers(data.members || [])
    } catch (error) {
      console.error('Failed to fetch expiring members:', error)
      setExpiringMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  const sendReminders = async () => {
    setIsSending(true)

    try {
      const response = await fetch('/api/members/send-expiry-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysThreshold: parseInt(daysThreshold) }),
      })

      const result = await response.json()
      setSendResult(result)
    } catch (error) {
      setSendResult({
        success: false,
        totalMembers: 0,
        sent: 0,
        failed: 0,
        results: [{ memberId: '', memberName: '', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error', daysLeft: 0 }]
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchExpiringMembers()
    } else {
      setExpiringMembers([])
      setSendResult(null)
    }
  }

  const membersWithWhatsApp = expiringMembers.filter(m => m.has_whatsapp)
  const membersWithoutWhatsApp = expiringMembers.filter(m => !m.has_whatsapp)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Send Expiry Reminders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Membership Expiry Reminders</DialogTitle>
          <DialogDescription>
            Send WhatsApp messages to members whose memberships are expiring soon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Days Threshold Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Expiring within</label>
              <Select value={daysThreshold} onValueChange={(value) => {
                setDaysThreshold(value)
                fetchExpiringMembers()
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExpiringMembers}
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Members List */}
          {!isLoading && expiringMembers.length > 0 && !sendResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{expiringMembers.length} members expiring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{membersWithWhatsApp.length} have WhatsApp</span>
                </div>
                {membersWithoutWhatsApp.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>{membersWithoutWhatsApp.length} missing WhatsApp</span>
                  </div>
                )}
              </div>

              <ScrollArea className="h-64 border rounded-lg">
                <div className="p-3 space-y-2">
                  {expiringMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{member.name_en}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.days_left <= 3 ? 'destructive' : 'secondary'}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {member.days_left} days left
                        </Badge>
                        {member.has_whatsapp ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            WhatsApp
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            No WhatsApp
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Send Button */}
              <Button
                onClick={sendReminders}
                disabled={isSending || membersWithWhatsApp.length === 0}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Reminders...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminders to {membersWithWhatsApp.length} Members
                  </>
                )}
              </Button>
            </div>
          )}

          {/* No Members */}
          {!isLoading && expiringMembers.length === 0 && !sendResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>No Expiring Memberships</AlertTitle>
              <AlertDescription>
                No members have memberships expiring within {daysThreshold} days.
              </AlertDescription>
            </Alert>
          )}

          {/* Send Results */}
          {sendResult && (
            <div className="space-y-3">
              {sendResult.sent > 0 ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Reminders Sent!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Successfully sent {sendResult.sent} of {sendResult.totalMembers} reminders.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Failed to Send</AlertTitle>
                  <AlertDescription>
                    No reminders were sent. Check the errors below.
                  </AlertDescription>
                </Alert>
              )}

              {/* Results List */}
              <ScrollArea className="h-48 border rounded-lg">
                <div className="p-3 space-y-2">
                  {sendResult.results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 text-sm"
                    >
                      <span>{result.memberName}</span>
                      <div className="flex items-center gap-2">
                        {result.status === 'sent' ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : result.status === 'no_whatsapp' ? (
                          <Badge variant="outline" className="text-yellow-600">
                            No WhatsApp
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button
                variant="outline"
                onClick={() => {
                  setSendResult(null)
                  fetchExpiringMembers()
                }}
                className="w-full"
              >
                Send More Reminders
              </Button>
            </div>
          )}

          {/* WhatsApp Setup Notice */}
          <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
            <p className="font-medium">WhatsApp Business API Setup Required:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Configure <code>WHATSAPP_PHONE_NUMBER_ID</code> in environment</li>
              <li>Configure <code>WHATSAPP_ACCESS_TOKEN</code> in environment</li>
              <li>Meta Business account with verified WhatsApp number</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
