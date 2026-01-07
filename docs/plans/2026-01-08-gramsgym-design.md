# Grams Gym Website - Design Document

**Date:** January 8, 2026
**Client:** Grams Gym, Amman, Jordan
**Tagline:** "Each Gram Matters"

---

## 1. Project Overview

### Business Context
- **Type:** Hybrid gym (open gym access + personal training)
- **Location:** Amman, Jordan
- **Owners:** 4 coaches (family business, equal access)
- **Hours:** Sat-Wed 7AM-11PM, Thu 7AM-9PM, Fri 6PM-9PM

### Goals
1. Manage gym memberships and PT packages
2. Automated notifications for expiring subscriptions (WhatsApp + Email)
3. AI chatbot for member questions
4. Separate portals for coaches and subscribers
5. Real-time PT session booking system

---

## 2. Tech Stack (2025 Best Practices)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 15 (App Router) | #1 React meta-framework, RSC support |
| Language | TypeScript (strict) | 78% industry adoption |
| Styling | Tailwind CSS + shadcn/ui | 2025 default for React projects |
| Backend | Supabase | Auth, PostgreSQL, Realtime, Edge Functions |
| AI | Vercel AI SDK + Gemini 3 Flash | Best for React AI apps |
| Notifications | WhatsApp Business API | Primary channel |
| Email | Resend | Backup notification channel |
| Deployment | Vercel | Optimal for Next.js |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  Next.js 15 (React) + Tailwind CSS + shadcn/ui         │
│  - Bilingual (AR/EN) with RTL support                  │
│  - Dark theme matching brand colors                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    Supabase                             │
│  - PostgreSQL Database                                  │
│  - Authentication (coach + subscriber)                  │
│  - Row Level Security                                   │
│  - Real-time subscriptions                              │
│  - Edge Functions (notifications)                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              External Services                          │
│  - Gemini AI (chatbot)                                 │
│  - WhatsApp Business API                               │
│  - Resend (email)                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### Core Tables

```sql
-- Coaches (also admins)
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  bio_en TEXT,
  bio_ar TEXT,
  specialty_en TEXT,
  specialty_ar TEXT,
  profile_photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Members (subscribers)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  bio_en TEXT,
  bio_ar TEXT,
  profile_photo_url TEXT,
  assigned_coach_id UUID REFERENCES coaches(id),
  preferred_language TEXT DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
  notification_preference TEXT DEFAULT 'whatsapp' CHECK (notification_preference IN ('whatsapp', 'email', 'both')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gym Memberships (time-based)
CREATE TABLE gym_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_paid DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PT Packages (session-based)
CREATE TABLE pt_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id),
  total_sessions INTEGER NOT NULL,
  remaining_sessions INTEGER NOT NULL,
  price_paid DECIMAL(10,2),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Coach Availability (weekly template)
CREATE TABLE coach_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings (actual scheduled sessions)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id),
  pt_package_id UUID REFERENCES pt_packages(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id, scheduled_at) -- Prevent double booking
);

-- Notification Log
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  message_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gym Info (chatbot knowledge base)
CREATE TABLE gym_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value_en TEXT NOT NULL,
  value_ar TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing (dynamic pricing for chatbot)
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('membership', 'pt_package')),
  duration_or_sessions TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Authentication & Authorization

### Two Login Flows

| Portal | URL | Auth Method |
|--------|-----|-------------|
| Coach | `/coach/login` | Email + Password |
| Member | `/member/login` | Email + Password, Magic Link |

### Role-Based Access (Supabase RLS)

```sql
-- Coaches have full access
CREATE POLICY "coaches_full_access" ON members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members access own data only
CREATE POLICY "members_own_data" ON members
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "members_own_bookings" ON bookings
  FOR ALL USING (auth.uid() = member_id);
```

### Security Features
- Passwords hashed via Supabase Auth (bcrypt)
- JWT tokens with role claims
- Session timeout: 7 days coaches, 30 days members
- Audit log for sensitive actions

---

## 5. Coach Dashboard

### URL Structure

```
/coach
├── /dashboard          → Overview stats
├── /members            → All members list
│   ├── /new            → Add member
│   └── /[id]           → Member detail
├── /bookings           → Calendar view
├── /schedule           → Manage availability
├── /subscriptions      → Active/expiring list
├── /notifications      → Send/view notifications
├── /settings           → Gym info, pricing
└── /reports            → Analytics
```

### Dashboard Features
- Today's bookings overview
- Expiring memberships widget (14, 7, 3, 0 days)
- Low PT sessions alerts
- Quick actions (add member, new subscription)
- Real-time updates via Supabase Realtime
- Export to Excel/CSV
- Full audit log

---

## 6. Subscriber Portal

### URL Structure

```
/member
├── /dashboard          → Status overview
├── /profile            → Edit info, preferences
├── /subscriptions      → View memberships & PT
├── /bookings           → Manage PT sessions
│   └── /new            → Book session
├── /history            → Past sessions
└── /chat               → AI assistant
```

### Features
- Subscription status cards
- Remaining sessions counter
- One-click PT booking
- Cancel up to 24 hours before
- Notification preferences
- Payment history
- AI chatbot access

---

## 7. Booking System

### Flow

1. Member selects coach (pre-selected if assigned)
2. Views coach's weekly availability calendar
3. Clicks available slot → confirmation modal
4. System transaction:
   - Verify slot available
   - Create booking
   - Decrement PT sessions
   - Broadcast realtime update
5. Notifications sent to member + coach

### Conflict Prevention
- Unique constraint on (coach_id, scheduled_at)
- Optimistic locking with Supabase
- Real-time subscription updates UI instantly
- Transaction rollback on conflict

---

## 8. Notification System

### Triggers

| Event | Timing | Channel |
|-------|--------|---------|
| Membership expiring | 14, 7, 3, 0 days | WhatsApp → Email |
| PT sessions low | 3, 1, 0 remaining | WhatsApp → Email |
| Booking confirmed | Immediate | WhatsApp + Email |
| Booking reminder | 24 hours before | WhatsApp |
| Booking cancelled | Immediate | WhatsApp + Email |

### Implementation
- Supabase Edge Function on CRON (daily 6 AM)
- WhatsApp Business API (official)
- Resend for email backup
- Pre-approved message templates (Arabic + English)

### WhatsApp Templates Needed
- `membership_expiry_reminder_ar` / `_en`
- `pt_sessions_low_ar` / `_en`
- `booking_confirmation_ar` / `_en`
- `booking_reminder_ar` / `_en`

---

## 9. AI Chatbot

### Capabilities
- Working hours queries
- Pricing information
- Coach details and selection
- Training schedules
- Equipment info
- Gym policies
- Promotions

### Implementation
- Vercel AI SDK + Gemini 3 Flash
- System prompt with gym personality
- Dynamic context injection from database
- Bilingual (responds in user's language)
- Floating widget on all pages

### System Prompt

```
You are the AI assistant for Grams Gym in Amman, Jordan.
Tagline: "Each Gram Matters"

PERSONALITY:
- Friendly, motivating, professional
- Respond in user's language (Arabic or English)
- Keep answers concise but helpful

RULES:
- Never make up information
- Direct complex issues to staff
- Don't discuss competitors
- Be encouraging about fitness
```

---

## 10. Public Website

### Pages

| Page | Content |
|------|---------|
| `/` (Home) | Hero, stats, coaches preview, location |
| `/about` | Story, mission, facilities gallery |
| `/coaches` | All 4 coaches with bios |
| `/pricing` | Memberships & PT packages |
| `/schedule` | Hours, class schedule |
| `/contact` | Map, contact form, socials |

### Design System

```css
/* Colors */
--primary: #2D2D2D;     /* Dark charcoal */
--secondary: #4A4A4A;   /* Medium gray */
--accent: #FF6B00;      /* Orange */
--text: #FFFFFF;        /* White */
--background: #1A1A1A;  /* Near black */

/* Typography */
--font-heading: 'Bebas Neue', sans-serif;
--font-body: 'Inter', sans-serif;
--font-arabic: 'Cairo', sans-serif;
```

### Features
- Dark theme throughout
- Orange accent for CTAs
- Bilingual toggle (AR/EN)
- RTL support for Arabic
- Mobile-first responsive
- Floating chatbot widget

---

## 11. Project Structure

```
gramsgym/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Home
│   │   ├── about/
│   │   ├── coaches/
│   │   ├── pricing/
│   │   ├── schedule/
│   │   └── contact/
│   ├── (auth)/
│   │   ├── coach/login/
│   │   └── member/login/
│   ├── coach/              # Coach dashboard
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── bookings/
│   │   ├── schedule/
│   │   ├── subscriptions/
│   │   ├── notifications/
│   │   ├── settings/
│   │   └── reports/
│   ├── member/             # Subscriber portal
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── subscriptions/
│   │   ├── bookings/
│   │   ├── history/
│   │   └── chat/
│   ├── api/
│   │   ├── chat/           # AI chatbot endpoint
│   │   └── webhooks/       # WhatsApp webhooks
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── chat/               # Chatbot components
│   ├── booking/            # Booking calendar
│   └── layout/             # Header, footer, nav
├── lib/
│   ├── supabase/           # Supabase client
│   ├── whatsapp/           # WhatsApp API
│   ├── ai/                 # Gemini integration
│   └── utils/
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
├── messages/               # i18n translations
│   ├── en.json
│   └── ar.json
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
└── docs/
    └── plans/
```

---

## 12. Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up Supabase project and database schema
- [ ] Implement authentication (coach + member)
- [ ] Create bilingual infrastructure (next-intl)

### Phase 2: Coach Dashboard
- [ ] Dashboard overview page
- [ ] Member management (CRUD)
- [ ] Subscription management
- [ ] Coach availability/schedule management
- [ ] Booking calendar view

### Phase 3: Subscriber Portal
- [ ] Member dashboard
- [ ] Profile management
- [ ] Subscription viewing
- [ ] PT session booking system
- [ ] Booking history

### Phase 4: Public Website
- [ ] Homepage with hero
- [ ] About page
- [ ] Coaches page
- [ ] Pricing page
- [ ] Contact page with map
- [ ] Responsive design + RTL

### Phase 5: AI Chatbot
- [ ] Vercel AI SDK integration
- [ ] Gemini 3 Flash setup
- [ ] System prompt configuration
- [ ] Dynamic context from database
- [ ] Floating chat widget

### Phase 6: Notifications
- [ ] WhatsApp Business API setup
- [ ] Message template approval
- [ ] Notification scheduler (Edge Function)
- [ ] Email backup (Resend)
- [ ] Notification logging

### Phase 7: Polish & Launch
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Security audit
- [ ] Testing (unit + E2E)
- [ ] Deployment to Vercel
- [ ] Domain setup

---

## 13. External Service Setup Required

### Supabase
- Project URL: `https://xptjisbsopvgbakjiqcp.supabase.co`
- Publishable Key: `sb_publishable_JuzBd-srOsGWRW0qh44jjQ_Yv73qgpX`
- Need: Service role key, database password

### WhatsApp Business API
- Create Meta Business account
- Set up WhatsApp Business API
- Create message templates
- Get approval for templates
- Configure webhooks

### Gemini AI
- Model: `gemini-3-flash-preview`
- Need: API key from Google AI Studio

### Resend (Email)
- Create account
- Verify domain
- Get API key

### Vercel
- Deploy from GitHub repo
- Configure environment variables
- Set up custom domain

---

## 14. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xptjisbsopvgbakjiqcp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...

# Gemini AI
GOOGLE_AI_API_KEY=...

# Resend (Email)
RESEND_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://gramsgym.com
```

---

## Appendix: Brand Assets

### Logo
- Primary: White/silver "GG" on dark background
- Accent color: Orange (#FF6B00)
- Font style: Geometric, industrial

### Tagline
- English: "Each Gram Matters"
- Arabic: "كل جرام مهم"

### Social
- Instagram: @gramsgym

---

*Document created: January 8, 2026*
*Last updated: January 8, 2026*
