# ApprenticePortal

A modern internal web platform for apprentices (Lernende) to explore teams, read trainer one-pagers, apply for their next stage, and stay up to date with upcoming events.

---

## Overview

ApprenticePortal centralizes the apprenticeship experience in one place. Apprentices can browse the 20 training teams, read each team's one-pager written by their trainer, and apply directly for their next stage. Trainers manage their own team pages. Admins and GBV (Grundbildungsverantwortliche) have full control over the platform.

---

## Features

### Teams
- Grid of all 20 training teams (Ausbildner)
- Click a team card to open its full one-pager
- One-pager describes what the team does, written by the trainer (Praxisbildner)
- **Apply** button at the bottom of each one-pager — opens a pre-filled email to the trainer with GBV on CC

### Events
- Event feed with upcoming dates
- Each event shows: title, date, time, location, description
- Managed by Praxisbildner and Admin/GBV

### User Management
- Role-based access control (see below)
- SSO via One Identity (SAML/OIDC)

---

## Roles & Permissions

| Feature | Lernender | Praxisbildner | GBV | Admin |
|---|---|---|---|---|
| View teams & one-pagers | ✅ | ✅ | ✅ | ✅ |
| Apply for stage (email) | ✅ | — | — | — |
| Edit own team one-pager | — | ✅ | ✅ | ✅ |
| Create / edit events | — | ✅ | ✅ | ✅ |
| Manage users | — | — | ✅ | ✅ |
| Full platform control | — | — | ✅ | ✅ |

> **GBV** (Grundbildungsverantwortlicher / Lehrmeister) has the same permissions as Admin.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Auth | One Identity SSO (SAML/OIDC) |
| Database | Supabase (PostgreSQL) |
| Hosting | TBD |

### Design
- System-aware dark / light mode (follows OS preference, manually toggleable)
- Minimalistic, modern, sleek — clean whitespace, clear typography
- Fully responsive

---

## Project Structure (planned)

```
src/
├── app/
│   ├── (public)/
│   │   └── login/
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── teams/
│   │   │   └── [teamId]/
│   │   ├── events/
│   │   └── admin/
├── components/
│   ├── teams/
│   ├── events/
│   └── ui/
├── lib/
│   ├── auth/
│   ├── db/
│   └── utils/
└── types/
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/lucatom966/ApprenticePortal.git
cd ApprenticePortal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run dev server
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SSO (One Identity)
SSO_CLIENT_ID=
SSO_CLIENT_SECRET=
SSO_ISSUER_URL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Roadmap

- [ ] Project setup (Next.js + Tailwind + shadcn)
- [ ] Auth integration (One Identity SSO)
- [ ] Team grid + one-pager pages
- [ ] Apply flow (mailto with pre-filled fields)
- [ ] Events feed
- [ ] Admin panel (user management, team editor, event editor)
- [ ] Dark / light mode toggle
- [ ] Mobile optimization
