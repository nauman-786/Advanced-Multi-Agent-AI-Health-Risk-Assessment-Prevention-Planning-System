'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  Sparkles, 
  User, 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  Clock, 
  Coffee, 
  Dumbbell, 
  Thermometer,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { healthApi, PatientData, HealthAnalysisResponse } from '@/lib/api';
import { ImageDropzone } from './ImageDropzone';
import { MdHealthAndSafety, MdAnalytics } from 'react-icons/md';
import dynamic from 'next/dynamic';

// Dynamically import ResultsDisplay with SSR disabled to fix Recharts ref errors
const ResultsDisplay = dynamic(() => import('./ResultsDisplay'), { 
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 animate-spin text-cyan-500" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Initializing Analytics Engine...</p>
      </div>
    </div>
  )
});

const familyHistoryOptions = [
  { id: 'diabetes', label: 'Diabetes', icon: '🍬' },
  { id: 'hypertension', label: 'Hypertension', icon: '🩺' },
  { id: 'cardiovascular', label: 'Heart Disease', icon: '❤️' },
  { id: 'cancer', label: 'Cancer', icon: '🎗️' },
  { id: 'asthma', label: 'Asthma', icon: '🫁' },
  { id: 'arthritis', label: 'Arthritis', icon: '🦴' },
];

const PresageDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthAnalysisResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Form state
  const [formData, setFormData] = useState<PatientData>({
    age: 35,
    sex: 'male',
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    blood_sugar_fasting: 90,
    cholesterol_total: 200,
    hdl_cholesterol: 50,
    bmi: 24,
    sleep_hours: 7,
    stress_level: 'low',
    smoking: false,
    alcohol: 'none',
    exercise_days_per_week: 3,
    iron_level: 75,
    cortisol: 15,
    family_history: [],
  });

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthApi.checkHealth();
      } catch (err) {
        setError('⚠️ Cannot connect to API server. Make sure FastAPI is running on http://127.0.0.1:8000');
      }
    };
    checkHealth();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? target.checked
          : type === 'number'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleFamilyHistoryChange = (disease: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      family_history: checked
        ? [...prev.family_history, disease]
        : prev.family_history.filter((d) => d !== disease),
    }));
  };

  const handleFilesAccepted = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await healthApi.analyzePatient(formData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-16 text-center md:text-left z-20"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <MdHealthAndSafety className="w-10 h-10 text-cyan-400" />
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            PRESAGE
          </h1>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl">
          Advanced Multi-Agent AI Health Risk Assessment & Prevention Planning System
        </p>
      </motion.div>

      {/* Alerts */}
      <motion.div className="relative mb-8 z-20 max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl flex items-center gap-4 overflow-hidden"
            >
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              </div>
              <div>
                <p className="text-rose-200 text-xs font-mono uppercase tracking-widest font-bold">System Warning</p>
                <p className="text-rose-200/70 text-[10px] font-mono leading-tight mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10 max-w-7xl mx-auto">
        {/* Left Column: Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="rounded-[32px] bg-slate-900/40 border border-slate-800 p-8 backdrop-blur-xl shadow-2xl sticky top-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Health Profile</h2>
              </div>
              <div className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-500">
                VER: 2.0.4
              </div>
            </div>

            <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all hover:bg-slate-950"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all hover:bg-slate-950 appearance-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Clinical Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Systolic</label>
                    <input
                      type="number"
                      name="blood_pressure_systolic"
                      value={formData.blood_pressure_systolic}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500/30 transition-all pl-12"
                    />
                    <Heart className="absolute left-4 bottom-4.5 w-4 h-4 text-slate-600 group-focus-within:text-rose-500 transition-colors" />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Diastolic</label>
                    <input
                      type="number"
                      name="blood_pressure_diastolic"
                      value={formData.blood_pressure_diastolic}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500/30 transition-all pl-12"
                    />
                    <Heart className="absolute left-4 bottom-4.5 w-4 h-4 text-slate-600 group-focus-within:text-rose-500 transition-colors opacity-60" />
                  </div>
                </div>

                <div className="space-y-2 relative group">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Glucose Level</label>
                  <input
                    type="number"
                    name="blood_sugar_fasting"
                    value={formData.blood_sugar_fasting}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-all pl-12"
                  />
                  <Zap className="absolute left-4 bottom-4.5 w-4 h-4 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                </div>
              </div>

              {/* Bio-Habits */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <Wind className="w-3 h-3" />
                  Life-Signals
                </h3>
                <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Wind className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-bold text-slate-300">Smoking Habit</span>
                  </div>
                  <button 
                    onClick={() => setFormData(p => ({ ...p, smoking: !p.smoking }))}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.smoking ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.smoking ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Rest (Hrs)</label>
                    <input
                      type="number"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Activity (D/W)</label>
                    <input
                      type="number"
                      name="exercise_days_per_week"
                      value={formData.exercise_days_per_week}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Pathologies */}
              <div className="space-y-4 relative">
                <div className="absolute -inset-1 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
                <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.2em] font-black flex items-center gap-2 relative z-10">
                  <Database className="w-3 h-3" />
                  Family History
                </h3>
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  {familyHistoryOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleFamilyHistoryChange(option.id, !formData.family_history.includes(option.id))}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 text-left ${
                        formData.family_history.includes(option.id)
                          ? 'bg-purple-500/10 border-purple-500/40 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-tight">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Records */}
              <div className="space-y-4 relative">
                <div className="absolute -inset-1 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
                <h3 className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em] font-black flex items-center gap-2 relative z-10">
                  <ShieldCheck className="w-3 h-3" />
                  Medical Assets
                </h3>
                <div className="relative z-10">
                  <ImageDropzone onFilesAccepted={handleFilesAccepted} loading={loading} />
                </div>
              </div>

              {/* Action */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-5 rounded-[24px] bg-white text-black font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span className="font-mono uppercase tracking-widest text-sm">Processing Data...</span>
                  </>
                ) : (
                  <>
                    <MdAnalytics className="w-6 h-6" />
                    <span className="uppercase tracking-tighter">Initiate Analysis</span>
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Results */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          {result ? (
            <ResultsDisplay result={result} patientData={formData} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[40px] bg-slate-900/20 border-2 border-dashed border-slate-800 p-16 backdrop-blur-xl flex items-center justify-center min-h-[600px] text-center"
            >
              <div>
                <motion.div 
                  className="relative mb-8 mx-auto w-24 h-24"
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20" />
                  <div className="relative bg-slate-900 p-6 rounded-[32px] border border-slate-800">
                    <Sparkles className="w-12 h-12 text-cyan-400 mx-auto" />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Awaiting Biometric Feed</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed uppercase font-mono text-xs tracking-widest">
                  Fill in your health profile and initialize the neural diagnostic engine.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PresageDashboard;
