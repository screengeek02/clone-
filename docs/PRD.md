# ConectaRD — Product Requirements Document (PRD)

## 1) Product Summary

**ConectaRD** is a location-first dating and social connection app tailored to the Dominican Republic (DR), inspired by swipe apps like Tinder but localized for Dominican culture, language, tourism patterns, and payment behavior.

### Mission
Build the fastest way for locals and tourists in DR to discover, match, and chat—while monetizing from day one through subscriptions and in-app purchases.

### Product Positioning
ConectaRD is not only a dating app. It is a **dating + social access + nightlife/lifestyle discovery** platform.

---

## 2) Goals and Non-Goals

### Goals (MVP)
1. Deliver a reliable swipe/match/chat loop for DR users.
2. Support bilingual UX (Spanish default, English optional).
3. Launch monetization in MVP (local premium + tourist premium + boosts).
4. Build trust systems (phone verification, reporting, block, profile verification).

### Non-Goals (MVP)
- Group events
- Video calls
- AI compatibility scoring
- Desktop/web client

These are planned for later phases.

---

## 3) Target Users

### A) Local Users (Primary Volume)
- **Age:** 18–40
- **Cities/Zones:** Santo Domingo, Santiago, Punta Cana, La Romana, Puerto Plata
- **Use cases:** dating, casual meetups, friends/networking, nightlife
- **Price sensitivity:** high (needs low-cost plans in DOP)

### B) Tourists / Expats (Primary Revenue Engine)
- **Stay length:** 5–14 days typical
- **Needs:** pre-arrival matching, quick local discovery, verified profiles, nightlife discovery
- **Price sensitivity:** lower (willing to pay for speed + visibility)

### User Personas
1. **Local Professional (Santo Domingo, 27)**
   - Uses app nightly, wants social + relationship options.
   - Pays for affordable monthly premium if ad-free and unlimited swipes.
2. **Tourist (Punta Cana, 33)**
   - Visits for one week, wants to connect immediately.
   - Pays for traveler week pass + boosts.
3. **Nightlife Connector (Santiago, 24)**
   - Uses nearby mode and voice notes.
   - Heavy usage during weekends and late-night windows.

---

## 4) Core Product Features (MVP)

### 4.1 Onboarding & Authentication
- Language selection on first launch: **Español / English**
- Phone signup with OTP verification (required)
- Optional social/email login for convenience (future-ready)
- Age gate (18+ mandatory)
- Terms & privacy consent

### 4.2 Profile Setup
- Name, age, gender
- Up to 6 photos
- Short bio (emoji-friendly)
- Intent tags (multi-select):
  - Casual
  - Relationship
  - Friends
  - Tour guide
  - Nightlife
- Instagram link (optional)
- Verification status badge (if verified)

### 4.3 Discovery (Swipe Stack)
- Swipe right = Like
- Swipe left = Pass
- Mutual right swipes create a match
- Free users have daily swipe limits
- Filters:
  - Distance radius (km)
  - Age range
  - City/zone presets (e.g., Punta Cana, Bávaro, SD Este/Norte/DN)
- “Nearby Now” mode for nightlife/resort activity windows

### 4.4 Matching
- Match only when both users like each other
- Match screen animation + CTA to start chat
- Optional WhatsApp-share shortcut after match (localized behavior)

### 4.5 Chat
- Real-time text messaging
- Emoji support
- Voice notes (high-priority for DR usage behavior)
- Controlled photo sharing
- Push notifications on new messages

### 4.6 Trust & Safety
- Block user
- Report user (spam, scam, harassment, fake profile)
- Phone verification required for account activation
- Optional selfie/photo verification
- “Verified Local” badge option
- In-app warning banners for common tourist scams

---

## 5) Monetization Design

### 5.1 Free Tier
- Limited swipes/day
- Limited visibility
- Ads enabled
- No boosts

### 5.2 Premium Local Tier
- **Price:** RD$199–RD$399/month
- Unlimited swipes
- See who liked you
- 1 boost/day
- Ad-free experience
- Location change within DR

### 5.3 Traveler Tier
- **Price:** USD $9.99–$19.99/week
- Passport mode (set destination before arrival)
- Priority profile visibility
- Tourist badge
- More boosts or unlimited boost pack (configurable)
- “Meet Locals Tonight” discovery feature

### 5.4 Microtransactions
- Profile Boost (30 min): USD $1.99
- Super Like: USD $0.99
- Nightlife Spotlight zone: USD $2.99

### 5.5 Phase 2 B2B Revenue
- Venue sponsored spots (bars/clubs/lounges)
- “Tonight’s Hot Spot” placements
- Sponsored visibility near partner venues

---

## 6) Detailed User Flows

### 6.1 First-Time User Flow
1. Open app → splash
2. Select language
3. Phone number input
4. OTP verification
5. Accept terms/privacy
6. Profile creation wizard
7. Upload photos
8. Set preferences (age/distance/intention)
9. Enter swipe feed

### 6.2 Match Flow
1. User A swipes right on User B
2. Record like
3. If User B already liked User A → create match
4. Trigger match event + push notification
5. Open match modal with “Send message” + optional WhatsApp shortcut

### 6.3 Premium Purchase Flow
1. Trigger paywall (feature gate or upsell CTA)
2. Display local/tourist plans dynamically by locale + account type
3. In-app purchase via Apple/Google billing (mobile stores)
4. Backend validates receipt/webhook
5. Entitlements updated in real time

---

## 7) Functional Requirements

### 7.1 Authentication
- Must support OTP request + verify endpoints
- Must block app access until phone verified
- Must maintain session refresh securely

### 7.2 Profile Management
- CRUD profile fields
- Photo upload, reorder, delete
- Moderation scan hook for photo safety
- Enforce max 6 photos

### 7.3 Discovery & Ranking
- Exclude blocked/reported users as needed
- Exclude previously passed users for configurable cooldown
- Prioritize by distance + activity recency + premium boosts
- Respect gender/age/distance preferences

### 7.4 Match Engine
- Idempotent like events
- Atomic mutual-like match creation
- Prevent duplicate match records

### 7.5 Messaging
- Real-time channel by match ID
- Message types:
  - text
  - voice
  - image
  - system (match created, verification updates)
- Read receipts optional (feature-flag)

### 7.6 Safety
- Report categories + free-text evidence
- Temporary auto-hide after X reports pending moderation review
- Permanent block relation table

### 7.7 Payments
- Subscription lifecycle handling:
  - active
  - grace_period
  - expired
  - canceled
- Consumables for boosts/super likes
- Entitlement checks on every gated action

---

## 8) Non-Functional Requirements

- **Performance:** swipe card render under 100ms on mid-range devices
- **Scalability:** support 10k MAU in MVP without architecture changes
- **Availability:** 99.5% backend uptime target
- **Security:** encrypt PII in transit and at rest
- **Compliance:** age 18+ and local privacy terms
- **Localization:** all user-facing strings available in ES/EN dictionaries

---

## 9) Suggested Tech Stack

### Frontend
- React Native (TypeScript)
- State management: Zustand/Redux Toolkit
- Navigation: React Navigation

### Backend
- Node.js + TypeScript (NestJS or Express)
- Realtime: WebSockets (Socket.IO) or Firebase realtime channels
- Auth: OTP provider (Twilio/MessageBird/local SMS gateway)

### Database
- PostgreSQL (core relational data)
- Redis (caching, queues, rate limits)
- Optional object storage for media (S3-compatible)

### Maps & Location
- Google Maps SDK / Places API
- Haversine distance calculation in backend queries

### Payments
- Apple IAP + Google Play Billing for mobile subscriptions
- Stripe optional for web/admin-side purchases

### Notifications
- Firebase Cloud Messaging (Android)
- APNs via Firebase or direct integration (iOS)

---

## 10) Data Model (Developer-Oriented)

```ts
User {
  id: string (uuid)
  phoneE164: string
  phoneVerifiedAt: timestamp | null
  name: string
  birthDate: date
  gender: 'male' | 'female' | 'non_binary' | 'other'
  bio: string
  language: 'es' | 'en'
  instagramUrl?: string
  isVerifiedPhoto: boolean
  isVerifiedLocal: boolean
  createdAt: timestamp
  updatedAt: timestamp
}

UserPhoto {
  id: string
  userId: string
  url: string
  sortOrder: number
  createdAt: timestamp
}

UserPreference {
  userId: string
  interestedIn: string[]
  ageMin: number
  ageMax: number
  maxDistanceKm: number
  cityZones: string[]
  lookingForTags: string[]
}

UserLocation {
  userId: string
  lat: number
  lng: number
  geohash: string
  updatedAt: timestamp
}

SwipeAction {
  id: string
  actorUserId: string
  targetUserId: string
  action: 'like' | 'pass' | 'super_like'
  createdAt: timestamp
}

Match {
  id: string
  userAId: string
  userBId: string
  createdAt: timestamp
  isActive: boolean
}

Message {
  id: string
  matchId: string
  senderUserId: string
  type: 'text' | 'voice' | 'image' | 'system'
  body: string
  mediaUrl?: string
  createdAt: timestamp
  readAt?: timestamp
}

Subscription {
  id: string
  userId: string
  tier: 'free' | 'premium_local' | 'traveler'
  provider: 'apple' | 'google' | 'stripe'
  providerRef: string
  status: 'active' | 'grace_period' | 'expired' | 'canceled'
  startsAt: timestamp
  endsAt: timestamp
}

Purchase {
  id: string
  userId: string
  productType: 'boost' | 'super_like' | 'spotlight'
  quantity: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: timestamp
}

Report {
  id: string
  reporterUserId: string
  targetUserId: string
  reason: 'spam' | 'scam' | 'harassment' | 'fake_profile' | 'other'
  details: string
  createdAt: timestamp
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed'
}

Block {
  blockerUserId: string
  blockedUserId: string
  createdAt: timestamp
}
```

---

## 11) API Surface (MVP)

### Auth
- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/refresh-token`

### Profile
- `GET /me`
- `PATCH /me`
- `POST /me/photos`
- `DELETE /me/photos/:photoId`

### Discovery
- `GET /discovery/cards`
- `POST /swipes` `{ targetUserId, action }`

### Matches & Chat
- `GET /matches`
- `GET /matches/:id/messages`
- `POST /matches/:id/messages`
- `POST /matches/:id/voice-upload-url`

### Safety
- `POST /users/:id/report`
- `POST /users/:id/block`

### Monetization
- `GET /billing/products`
- `POST /billing/subscribe`
- `POST /billing/purchase-consumable`
- `POST /billing/webhooks/apple`
- `POST /billing/webhooks/google`

---

## 12) Matching & Ranking Logic (Pseudo)

```ts
function canSeeCandidate(viewer, candidate): boolean {
  if (isBlockedEitherWay(viewer.id, candidate.id)) return false;
  if (!withinAgePreference(viewer.pref, candidate.age)) return false;
  if (!withinDistance(viewer.location, candidate.location, viewer.pref.maxDistanceKm)) return false;
  if (wasRecentlyPassed(viewer.id, candidate.id)) return false;
  return true;
}

function rankCandidate(viewer, candidate): number {
  const distanceScore = normalizedDistanceScore(viewer.location, candidate.location);
  const activityScore = recentActivityScore(candidate.lastActiveAt);
  const premiumBoostScore = candidate.hasActiveBoost ? 0.2 : 0;
  const verificationScore = candidate.isVerifiedPhoto ? 0.1 : 0;
  return distanceScore + activityScore + premiumBoostScore + verificationScore;
}

function processSwipe(actorId, targetId, action) {
  saveSwipe(actorId, targetId, action);
  if (action === 'like' || action === 'super_like') {
    if (hasPositiveSwipe(targetId, actorId)) {
      return createMatch(actorId, targetId);
    }
  }
  return null;
}
```

---

## 13) Screen List and UI Requirements

1. Splash
2. Language Selection
3. Login / OTP
4. Profile Setup Wizard
5. Photo Upload
6. Discovery Swipe Screen
7. Match Celebration Modal
8. Matches Inbox
9. Chat Thread
10. Premium Paywall
11. Settings & Safety
12. Report / Block Flows

### UI Notes
- Card-first design with large photos
- Fast swipe animations (60fps target)
- Nightlife-friendly dark mode optional
- Clear trust markers (verified badges)

---

## 14) Analytics Events (MVP)

- `signup_started`
- `signup_completed`
- `profile_completed`
- `swipe_right`
- `swipe_left`
- `match_created`
- `chat_message_sent`
- `voice_note_sent`
- `paywall_viewed`
- `subscription_started`
- `boost_purchased`
- `report_submitted`

### KPI Dashboard
- DAU / MAU
- Swipe-to-match conversion
- Match-to-chat conversion
- 7-day retention
- ARPPU by tier (local vs tourist)

---

## 15) QA and Acceptance Criteria

### Core Test Cases
1. OTP flow succeeds and rejects invalid codes.
2. User cannot enter app without verification.
3. Swipe right/right creates exactly one match.
4. Blocked users never appear in discovery.
5. Chat only available for active matches.
6. Purchase success grants feature entitlement instantly.
7. Subscription expiration removes gated access.
8. Reporting flow creates moderation ticket.

### Edge Cases
- GPS disabled
- Poor network conditions
- Tourist changing city before arrival
- Attempted abuse/spam behavior bursts (rate limiting)

---

## 16) Launch Plan

### Phase 1 (MVP)
- Onboarding + profile + swipes + matches + chat
- Free and premium local tier
- Basic boosts and safety tools

### Phase 2
- Traveler tier optimization
- Venue partnerships and sponsored placements
- Expanded analytics and growth loops

### Phase 3
- AI recommendations
- Video intros/calls
- Regional expansion (Puerto Rico, Colombia, Jamaica)

---

## 17) Revenue Projection (Conservative Example)

Assume monthly:
- 10,000 total active users
- 5% local premium = 500 users × $5 = $2,500
- 2% tourist plans = 200 users × $15 = $3,000
- Boosts + ads = $1,500

**Estimated early monthly revenue: ~$7,000**

High season tourism and nightlife partnerships can materially increase this.

---

## 18) Build-Ready Delivery Checklist for Codex

A code generator/developer can start implementation immediately if the following are created in the repo:

1. Mobile app scaffold (React Native + TypeScript)
2. Backend scaffold (Node + TypeScript)
3. SQL migrations for all models above
4. REST endpoints listed in Section 11
5. WebSocket messaging channel by `matchId`
6. Payment product configuration for local + traveler tiers
7. Event tracking hooks for Section 14
8. Feature flags for Nearby Now / WhatsApp shortcut / read receipts
9. Admin moderation panel endpoints (minimum report queue)
10. CI pipeline running tests + lint + typecheck

This PRD is intended as the single source of truth for MVP delivery.
