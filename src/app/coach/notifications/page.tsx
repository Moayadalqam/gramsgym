import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Mail, MessageSquare } from 'lucide-react'
import { isDemoMode } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'

interface NotificationLog {
  id: string
  member_id: string
  type: string
  channel: string
  message_content: string | null
  status: string
  sent_at: string | null
  created_at: string
  member?: {
    name_en: string
    name_ar: string
  }
}

export default async function NotificationsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()

  let notifications: NotificationLog[] = []

  if (demoMode === 'coach') {
    // Demo notifications
    notifications = [
      {
        id: '1',
        member_id: 'demo-member',
        type: 'booking_reminder',
        channel: 'whatsapp',
        message_content: 'Reminder: You have a PT session tomorrow at 10:00 AM',
        status: 'sent',
        sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        member: { name_en: 'Ahmad Khalil', name_ar: 'أحمد خليل' }
      },
      {
        id: '2',
        member_id: 'demo-member-2',
        type: 'membership_expiry',
        channel: 'email',
        message_content: 'Your gym membership will expire in 7 days',
        status: 'sent',
        sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        member: { name_en: 'Sara Ahmed', name_ar: 'سارة أحمد' }
      },
      {
        id: '3',
        member_id: 'demo-member',
        type: 'booking_confirmation',
        channel: 'whatsapp',
        message_content: 'Your booking has been confirmed for Jan 15 at 3:00 PM',
        status: 'pending',
        sent_at: null,
        created_at: new Date().toISOString(),
        member: { name_en: 'Ahmad Khalil', name_ar: 'أحمد خليل' }
      },
    ]
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    const { data } = await client
      .from('notifications_log')
      .select(`
        *,
        member:members(name_en, name_ar)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    notifications = data || []
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-500">Sent</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking_reminder':
        return 'Booking Reminder'
      case 'booking_confirmation':
        return 'Booking Confirmation'
      case 'membership_expiry':
        return 'Membership Expiry'
      case 'pt_package_low':
        return 'PT Sessions Low'
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">View sent and pending notifications to members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>Recent notifications sent to members</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getChannelIcon(notification.channel)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{notification.member?.name_en || 'Unknown'}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{getTypeLabel(notification.type)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message_content || 'No message content'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{notification.channel}</span>
                      <span>•</span>
                      <span>
                        {notification.sent_at
                          ? formatDistanceToNow(new Date(notification.sent_at), { addSuffix: true })
                          : formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div>{getStatusBadge(notification.status)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
