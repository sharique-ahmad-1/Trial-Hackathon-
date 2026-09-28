# CropPilot AI 🌾
> **Next-Generation AI-Powered Agricultural Advisory & Farm Intelligence Platform**

Built with **Google Antigravity IDE**, **Google Gemini 2.5 Flash**, **Supabase Cloud PostgreSQL**, and **Render**.

---

## 🌟 Key Features

1. **AI Crop Diagnostic Lab**:
   - Analyzes crop symptoms, growth stages, soil types, and weather conditions.
   - Powered by **Google Gemini 2.5 Flash** for rapid, accurate plant pathology diagnosis.
   - Dual-track treatment plans: **Organic/Bio-control remedies** & **Targeted chemical prescriptions**.
   - Severity scoring (Low, Moderate, High, Critical) and confidence ratings.
   - Irrigation & fertilizer adjustment recommendations.

2. **Farm & Field Registry**:
   - Complete multi-farm entity hierarchy (Farms ➔ Fields ➔ Crops).
   - Tracks crop varieties, planting dates, soil types, and current acreage.
   - Backed by **Supabase Cloud PostgreSQL** with Row-Level Security (RLS).

3. **Historical Advisory Archive**:
   - Automatically archives all past diagnoses and treatments in Supabase.
   - Audit trail of crop health issues for seasonal analysis and yield optimization.

4. **Production Architecture**:
   - **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons (Deployable on Vercel).
   - **Backend**: Node.js & Express API with Zod validation and CORS (Deployable on Render).
   - **AI Engine**: Google Gemini API via `@google/genai` / REST.
   - **Database**: Supabase PostgreSQL with automated SQL migrations.

---

## 🛠️ Tech Stack & Topology

```
                  ┌─────────────────────────────────────────┐
                  │    React 18 + Vite (Tailwind CSS)       │
                  │             (Vercel)                    │
                  └────────────────────┬────────────────────┘
                                       │ HTTP / JSON
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Express.js REST API Server        │
                  │             (Render.com)                │
                  └─────────────┬─────────────────────┬─────┘
                                │                     │
                                ▼                     ▼
     ┌────────────────────────────────┐ ┌────────────────────────────────┐
     │  Google Gemini 2.5 Flash API   │ │ Supabase Cloud PostgreSQL      │
     │  (AI Crop Pathology Engine)    │ │ (Farms, Fields, Crops, Advice) │
     └────────────────────────────────┘ └────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ & npm
- Supabase account & Project
- Google AI Studio Gemini API Key

### 2. Database Migration
Run the automated migration runner to apply all tables and seed data to Supabase:
```bash
npm run migrate
```

### 3. Backend Setup
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
# Web application starts on http://localhost:5173
```

---

## 📄 License
MIT License. Created for the Trial Hackathon.