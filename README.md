# WellTrack Senior 💙
> **Mobile-Friendly Health & Wellness Tracker designed with an Intuitive, Beginner-Friendly, and Senior-Accessible UI**

Built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Lucide Icons**, and **Supabase Cloud PostgreSQL & Auth**.

---

## 🌟 Key Features

### 1. 🥗 Diet Planning & Calorie Tracker (`/diet`)
* **Daily Meal Logging**: Log Breakfast, Lunch, Dinner, and Snacks with immediate nutritional breakdown (Calories, Protein, Carbs, Fat, Fiber).
* **Calorie Budget Meter**: Real-time progress bar tracking daily food intake vs user target (e.g. 1040 / 1800 kcal) with remaining calories indicator.
* **Customized Senior Diet Plans**:
  - **Cardio-Shield Senior Plan**: Low-sodium, heart-healthy plan for managing hypertension.
  - **Glucocare Diabetic Friendly**: Low glycemic index meals for steady blood sugar.
  - **Joint Ease & Mobility Plan**: Anti-inflammatory calcium & Vitamin D rich plan for arthritis.
* **Audio Voice Readout**: One-tap text-to-speech button to read meal plans and daily calorie status aloud for seniors.

### 2. 💊 Medication & Pill Reminder (`/medications`)
* **Visual Pill Identifiers**: Color-coded badges (Blue, Amber, Rose, Purple, Green) and clear pill shapes so elderly users can recognize their medicines at a glance.
* **Daily Dose Tracker**: Timings (Morning, Afternoon, Evening, Night) with meal relations (*After Food*, *Before Food*, *With Water*).
* **One-Tap "Mark as Taken"**: Large touch button that instantly checks off the dose with timestamp.
* **Live Alerts**: Visual notifications for remaining doses.

### 3. 👤 User Authentication & Profile (`/profile` & `/auth`)
* **Supabase Auth Ready**: Complete Email/Password login and signup screen.
* **1-Click Demo Evaluator Access**: Direct bypass button to review the application as **Ramesh Sharma (Age 68)** without email verification delays.
* **Comprehensive Health Profile**:
  - Medical conditions chips (Hypertension, Arthritis)
  - Drug & food allergy warnings (Penicillin)
  - Blood group (B+)
  - Emergency Caregiver contact with direct dial integration (`tel:`)

### 4. 👓 Senior-First UI/UX Accessibility Standards
* **High Contrast Mode**: One-tap toggle for ultra-high contrast (Black/Yellow/White) designed for visually impaired users.
* **Large Readable Typography**: 18px base text scale with an optional **Large Font (22px)** toggle.
* **Generous Touch Targets**: All buttons meet accessibility guidelines (minimum 48px touch height/width).
* **Emergency SOS Button**: Pulsing red button in the header opening a dedicated emergency modal with direct phone triggers for Family Caregivers, Family Doctor, and Ambulance (108).
* **Audio Voice Assistant**: Web Speech Synthesis integration to read instructions aloud.

---

## 🛠️ Tech Stack & Topology

* **Framework**: Next.js 14 (App Router)
* **Frontend**: React 18, Tailwind CSS, Lucide React
* **Database**: Supabase Cloud PostgreSQL with Row Level Security (RLS)
* **Authentication**: Supabase Auth (Email/Password + Demo Profile)
* **Deployment**: Vercel & Render Ready

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ & npm
- Supabase Project (`kcodussczqgiagwtlrxw` already pre-configured)

### 2. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database Schemas (Supabase)

All tables are live in Supabase and documented in `supabase/migrations/002_health_tracker_schema.sql`:
1. `public.profiles`: Stores patient name, age, medical conditions, allergies, and caregiver contacts.
2. `public.medications`: Daily medicines, dosage, schedule time, visual pill color, and taken/pending status.
3. `public.meals`: Food logs with calories, protein, carbs, and fiber.
4. `public.diet_plans`: Tailored senior diet plans with breakfast, lunch, and dinner schedules.

---

## 🌐 Deploy to Vercel (1-Click)

1. Push this repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Keep default settings (Framework: Next.js).
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://kcodussczqgiagwtlrxw.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your_supabase_anon_key`
5. Click **Deploy**!