# PRESAGE Next.js Frontend - Quick Start Guide

## 🚀 Project Status

**✅ COMPLETE** - Modern React/Next.js frontend with TypeScript, Tailwind CSS, and Framer Motion animations.

### Completed Components

#### 1. **PresageDashboard** (`components/PresageDashboard.tsx`)
Main dashboard with 3-column layout:
- **Left Column**: Patient profile form (16 fields)
- **Right Columns**: Results display (health score, risk assessment, interventions)
- Features:
  - Real-time API health check on load
  - Form state management for all patient metrics
  - Loading states with spinners
  - Error handling with helpful messages
  - Animated health index ring (0-100 scale)

#### 2. **RiskVisualization** (`components/RiskVisualization.tsx`)
Disease risk assessment display:
- SVG circular progress indicators with dynamic colors
- Animated entrance and progress transitions
- Risk level badges (High/Elevated/Moderate/Low)
- Displays: Diabetes, Hypertension, Cardiovascular risk percentages

#### 3. **ImageDropzone** (`components/ImageDropzone.tsx`)
Medical document upload interface:
- Drag-and-drop file upload (images, PDFs)
- File preview list
- Framer Motion animations
- Loading state support

#### 4. **API Client** (`lib/api.ts`)
Axios HTTP client with:
- Type-safe interfaces for PatientData and HealthAnalysisResponse
- 3-minute timeout for long-running analyses
- Health check endpoint
- Analysis endpoint POST handler

## 📋 Configuration

### Environment Variables
Created `.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Package Dependencies Installed
```
react-dropzone      - File upload handling
axios               - HTTP client
recharts            - Charting library
framer-motion       - Animations
lucide-react        - Icon library
```
**Total: 418 npm packages installed**

## 🎯 How to Run

### Terminal 1: Start the FastAPI Backend
```bash
cd e:\New folder (2)\future
python main.py
```
- API runs on: http://127.0.0.1:8000
- Health check: http://127.0.0.1:8000/health
- Analysis endpoint: http://127.0.0.1:8000/analyze (POST)

### Terminal 2: Start the Next.js Frontend
```bash
cd "e:\New folder (2)\future\client"
npm run dev
```
- Frontend runs on: http://localhost:3000
- Hot reload enabled for development
- TypeScript type-checking during development

## 📊 Using the Dashboard

1. **Fill Patient Profile** (Left Column)
   - Age, Sex
   - Blood pressure (systolic/diastolic)
   - Fasting blood sugar
   - BMI
   - Lifestyle metrics (sleep, exercise, smoking, alcohol)

2. **Click "🚀 Run Health Analysis"**
   - Form validates data
   - Sends POST request to FastAPI backend
   - Shows loading spinner during processing

3. **View Results** (Right Columns)
   - **Overall Health Index**: 0-100 score with animated ring
   - **Disease Risk Assessment**: Diabetes/Hypertension/Cardiovascular percentages
   - **Risk Explanations**: Clinical factors driving the assessment
   - **90-Day Prevention Plan**: Personalized interventions and timeline

## 🔌 API Integration

### Request Flow
```
Browser Form → POST /analyze
               ↓
           FastAPI Backend (main.py)
               ↓
           Multi-Agent Orchestrator
               ├─ Data Agent (validation)
               ├─ Risk Agent (clinical calculator)
               ├─ Literature Agent (PubMed search)
               └─ Intervention Agent (90-day plan)
               ↓
           HealthAnalysisResponse (JSON)
               ↓
           Display Results with Animations
```

### Request/Response Format
**Request (PatientData):**
```typescript
{
  age: number,
  sex: "male" | "female" | "other",
  blood_pressure_systolic: number,
  blood_pressure_diastolic: number,
  blood_sugar_fasting: number,
  cholesterol_total: number,
  hdl_cholesterol: number,
  bmi: number,
  sleep_hours: number,
  stress_level: "low" | "medium" | "high",
  smoking: boolean,
  alcohol: "none" | "moderate" | "heavy",
  exercise_days_per_week: number,
  iron_level: number,
  cortisol: number,
  family_history: string[]
}
```

**Response (HealthAnalysisResponse):**
```typescript
{
  overall_health_score: 75,
  risk_scores: {
    diabetes: 35,
    hypertension: 42,
    cardiovascular: 48
  },
  risk_explanations: "...",
  profile_summary: "...",
  evidence: "...",
  intervention_plan: "..."
}
```

## 🎨 Theme & Styling

### Color Scheme
- **Background**: Slate-950 to slate-900 gradient
- **Accents**: Cyan-400/500 and blue-400/500
- **Cards**: Slate-900 with 50% opacity + backdrop blur
- **Borders**: Cyan-500 with 20% opacity

### Typography
- **Headings**: Cyan-400 gradient text
- **Primary Text**: White
- **Secondary Text**: Slate-300 to slate-400
- **Disabled**: Reduced opacity

## ⚙️ Development Tips

### Add New Form Fields
Edit `PresageDashboard.tsx`:
1. Add field to `PatientData` interface in `lib/api.ts`
2. Add input element in left column
3. Add to `handleInputChange()` state management
4. Update form submission

### Customize Risk Colors
Edit `RiskVisualization.tsx`:
```typescript
const getRiskColor = (risk: number) => {
  if (risk >= 80) return '#ef4444'; // red
  if (risk >= 60) return '#f97316'; // orange
  if (risk >= 40) return '#eab308'; // yellow
  return '#22c55e'; // green
};
```

### Extend Result Display
Add new sections to `PresageDashboard.tsx` right column (after `intervention_plan`):
```tsx
<motion.div className="rounded-xl bg-slate-900/50 border border-cyan-500/20 p-6">
  <h3>New Section</h3>
  <p>{result.new_field}</p>
</motion.div>
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to API server" | Ensure FastAPI is running on port 8000 |
| CORS errors in console | Backend has CORSMiddleware enabled |
| Form not submitting | Check browser console for validation errors |
| Slow analysis | Analysis takes 30-120s depending on system |
| Images not uploading | ImageDropzone component created but not yet integrated |

## 📁 Project Structure

```
client/
├── app/
│   ├── layout.tsx         ← Root layout (dark theme)
│   ├── page.tsx           ← Entry point (renders PresageDashboard)
│   └── globals.css        ← Tailwind directives
├── components/
│   ├── PresageDashboard.tsx  ← Main dashboard (3-column layout)
│   ├── RiskVisualization.tsx ← Risk ring animations
│   └── ImageDropzone.tsx     ← File upload interface
├── lib/
│   └── api.ts             ← Axios client & TypeScript interfaces
├── .env.local             ← API endpoint configuration
├── next.config.ts         ← Next.js configuration
├── tailwind.config.ts     ← Tailwind CSS configuration
├── tsconfig.json          ← TypeScript configuration
└── package.json           ← Dependencies
```

## ✨ Features Implemented

✅ Dark theme with neon accents  
✅ Responsive grid layout (mobile-friendly)  
✅ 16-field patient profile form  
✅ Real-time API connectivity check  
✅ Animated health score visualization  
✅ Disease risk assessment display  
✅ Clinical risk explanations  
✅ 90-day intervention plan  
✅ Loading states with spinners  
✅ Error handling with helpful messages  
✅ Framer Motion animations throughout  
✅ Full TypeScript type safety  
✅ Tailwind CSS styling  
✅ Responsive design  

## 🚢 Deployment (Future)

To deploy to production:
1. Build: `npm run build`
2. Deploy to Vercel: `vercel deploy`
3. Or containerize with Docker

## 📞 Support

For issues or questions:
1. Check API logs: `python main.py` terminal output
2. Check browser console: F12 → Console tab
3. Verify environment variables: `.env.local` contains correct API URL
4. Ensure both services running on correct ports (3000 for Next.js, 8000 for API)
