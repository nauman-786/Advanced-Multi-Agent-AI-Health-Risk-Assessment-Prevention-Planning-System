'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  Heart, 
  Droplets, 
  Zap, 
  Apple, 
  Dumbbell, 
  Moon, 
  Brain, 
  Award, 
  Target, 
  Flame,
  Activity,
  Shield,
  Stethoscope,
  Info,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Check
} from 'lucide-react';
import { PatientData } from '@/lib/api';

interface ResultsDisplayProps {
  result: {
    overall_health_score: number;
    risk_scores: {
      diabetes: number;
      hypertension: number;
      cardiovascular: number;
    };
    risk_explanations: string;
    profile_summary: string;
    evidence: string;
    intervention_plan: string;
  };
  patientData: PatientData;
}

// Advanced Markdown & Table Parser for Human Clarity
const parseMarkdown = (text: string) => {
  if (!text) return <p className="text-slate-500 italic">No information available.</p>;
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter(r => !r.every(cell => cell.includes('---')));
      
      elements.push(
        <div key={`table-${currentIndex++}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-xl">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-900/80">
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-[10px] font-black text-cyan-400 uppercase tracking-widest border-b border-slate-800">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-cyan-500/5 transition-colors border-b border-slate-800/50 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-[11px] text-slate-300 leading-relaxed font-light">{cell.trim().replace(/<br\s*\/?>/gi, '\n')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table Detection
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf(c) > 0 && line.indexOf(c) < line.length - 1);
      if (cells.length > 0) {
        tableRows.push(cells);
        continue;
      }
    } else {
      flushTable();
    }

    if (!line) continue;

    if (line.startsWith('###')) {
      elements.push(
        <h3 key={`h3-${currentIndex++}`} className="text-base font-black text-cyan-400 mt-8 mb-4 uppercase tracking-widest flex items-center gap-3">
          <div className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          {line.replace(/###\s*/g, '')}
        </h3>
      );
      continue;
    }

    if (line.startsWith('##')) {
      elements.push(
        <h2 key={`h2-${currentIndex++}`} className="text-2xl font-black text-white mt-12 mb-6 uppercase tracking-tighter border-b-2 border-slate-800 pb-3 flex items-center gap-4">
          <FileText className="w-6 h-6 text-cyan-500" />
          {line.replace(/##\s*/g, '')}
        </h2>
      );
      continue;
    }

    if (/^\d+\./.test(line) || line.startsWith('•') || line.startsWith('-')) {
      const content = line.replace(/^(\d+\.|•|-)\s*/, '');
      const match = content.match(/^\*\*(.*?)\*\*:\s*(.*)/);

      if (match) {
        elements.push(
          <div key={`list-${currentIndex++}`} className="mb-4 p-5 rounded-[28px] bg-slate-900/60 border border-slate-800 group hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-1.5 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <p className="font-black text-white text-sm mb-1 tracking-tight">{match[1]}</p>
                <p className="text-slate-400 text-xs leading-relaxed font-light">{match[2]}</p>
              </div>
            </div>
          </div>
        );
      } else {
        elements.push(
          <div key={`item-${currentIndex++}`} className="flex gap-4 mb-3 ml-4">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 mt-2 flex-shrink-0" />
            <p className="text-slate-400 text-sm leading-relaxed font-light">{content}</p>
          </div>
        );
      }
      continue;
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    elements.push(
      <p key={`text-${currentIndex++}`} className="text-slate-300 text-sm leading-relaxed mb-5 font-light">
        {parts.map((part, idx) => part.startsWith('**') && part.endsWith('**') ? (
          <span key={idx} className="font-bold text-white border-b border-cyan-500/30">{part.replace(/\*\*/g, '')}</span>
        ) : part)}
      </p>
    );
  }
  flushTable();
  return elements;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, patientData }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const riskData = [
    { name: 'Diabetes', value: result.risk_scores.diabetes, fill: '#F59E0B' },
    { name: 'Hypertension', value: result.risk_scores.hypertension, fill: '#EF4444' },
    { name: 'Cardiovascular', value: result.risk_scores.cardiovascular, fill: '#EC4899' },
  ];

  const vitalsComparison = [
    { name: 'Systolic BP', val: patientData.blood_pressure_systolic, ref: 120 },
    { name: 'Diastolic BP', val: patientData.blood_pressure_diastolic, ref: 80 },
    { name: 'Blood Sugar', val: patientData.blood_sugar_fasting, ref: 95 },
    { name: 'Cholesterol', val: patientData.cholesterol_total, ref: 190 },
  ];

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-cyan-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStatusStroke = (score: number) => {
    if (score >= 80) return '#34d399';
    if (score >= 60) return '#22d3ee';
    if (score >= 40) return '#fbbf24';
    return '#fb7185';
  };

  if (!mounted) return null;

  // Find max value for dynamic scaling of Bar Chart
  const maxVitalVal = Math.max(...vitalsComparison.map(v => Math.max(v.val, v.ref))) * 1.2;

  // Radii for Custom Radial Chart
  const radii = [100, 75, 50];

  return (
    <div className="space-y-10 pb-32 max-w-6xl mx-auto">
      {/* SECTION 1: THE BIG PICTURE - WHAT IS WRONG? */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[56px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/60 border border-slate-800 rounded-[48px] p-8 md:p-12 backdrop-blur-3xl shadow-2xl overflow-hidden">
          
          {/* Health Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-8 lg:pb-0 lg:pr-8">
             <div className="relative mb-8">
               <svg className="w-64 h-64 transform -rotate-90">
                 <circle cx="128" cy="128" r="110" fill="none" stroke="#0a0f1e" strokeWidth="16" />
                 <motion.circle
                   cx="128" cy="128" r="110" fill="none" stroke={getStatusStroke(result.overall_health_score)} strokeWidth="16"
                   strokeDasharray={2 * Math.PI * 110}
                   initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                   animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - result.overall_health_score / 100) }}
                   transition={{ duration: 2.5, ease: "circOut" }}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className={`text-8xl font-black tracking-tighter ${getStatusColor(result.overall_health_score)}`}>{result.overall_health_score}</span>
                 <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em] font-bold mt-2">Score</span>
               </div>
             </div>
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Status</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">
                   <Shield className="w-3 h-3" /> Fully Verified
                </div>
             </div>
          </div>

          {/* Core Diagnosis */}
          <div className="lg:col-span-8 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase">What is Wrong?</h3>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Primary Health Assessment</p>
                </div>
              </div>
              <div className="p-8 rounded-[32px] bg-slate-950/80 border border-slate-800/50 shadow-inner group/card hover:border-rose-500/30 transition-colors duration-500">
                <p className="text-xl text-slate-200 font-medium leading-relaxed italic border-l-4 border-rose-500 pl-6">
                  "{result.profile_summary}"
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] font-black flex items-center gap-3">
                  <Activity className="w-3.5 h-3.5" /> Neural Analysis Breakdown
               </h4>
               <div className="text-slate-400 text-sm leading-relaxed font-light max-h-[200px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800">
                  {parseMarkdown(result.risk_explanations)}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE DATA - CUSTOM HIGH-PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Custom Comparison Chart: Actual vs Optimal */}
        <div className="p-10 rounded-[48px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 p-12 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-cyan-400" /> Biometric Variance
              </h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">Comparing your data to clinical targets</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-cyan-500"></div><span className="text-[10px] font-mono text-slate-400 uppercase">Your Level (Normal)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500"></div><span className="text-[10px] font-mono text-slate-400 uppercase">Your Level (High)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-700"></div><span className="text-[10px] font-mono text-slate-400 uppercase">Clinical Target</span></div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-around gap-2 pt-10 relative z-10 min-h-[250px]">
            {vitalsComparison.map((item, i) => {
              const valHeight = (item.val / maxVitalVal) * 100;
              const refHeight = (item.ref / maxVitalVal) * 100;
              const isHigh = item.val > item.ref;

              return (
                <div key={i} className="flex flex-col items-center gap-4 h-full justify-end w-full group/bar relative">
                  <div className="flex items-end gap-1.5 h-full w-full justify-center relative">
                     
                     {/* Value Bar */}
                     <div className="w-8 relative flex items-end justify-center group-hover/bar:brightness-125 transition-all duration-300" style={{ height: `${valHeight}%` }}>
                        <div className={`w-full rounded-t-lg absolute bottom-0 transition-all duration-1000 ${isHigh ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`} style={{ height: '100%' }} />
                        <span className="absolute -top-7 text-[11px] font-black text-white">{item.val}</span>
                     </div>
                     
                     {/* Target Bar */}
                     <div className="w-8 relative flex items-end justify-center opacity-50 group-hover/bar:opacity-100 transition-all duration-300" style={{ height: `${refHeight}%` }}>
                        <div className="w-full bg-slate-700 rounded-t-lg absolute bottom-0 transition-all duration-1000" style={{ height: '100%' }} />
                        <span className="absolute -top-7 text-[11px] font-black text-slate-400">{item.ref}</span>
                     </div>

                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter text-center">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Risk Radial: Disease Propensity */}
        <div className="p-10 rounded-[48px] bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" /> Risk Propensity
            </h3>
            <div className="px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 text-[8px] font-mono text-amber-500 uppercase tracking-widest">Active Monitoring</div>
          </div>
          
          <div className="flex-1 flex justify-center items-center w-full min-h-[250px] relative z-10">
            <svg className="w-full h-full max-w-[300px] max-h-[300px] drop-shadow-2xl" viewBox="0 0 240 240">
              {riskData.map((r, i) => {
                 const c = 2 * Math.PI * radii[i];
                 const strokeDashoffset = c - (r.value / 100) * c;
                 return (
                   <g key={r.name} className="hover:brightness-125 transition-all duration-300 cursor-pointer">
                     <circle cx="120" cy="120" r={radii[i]} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
                     <motion.circle 
                       cx="120" cy="120" r={radii[i]} 
                       fill="none" 
                       stroke={r.fill} 
                       strokeWidth="18" 
                       strokeDasharray={c} 
                       initial={{ strokeDashoffset: c }}
                       animate={{ strokeDashoffset: strokeDashoffset }}
                       transition={{ duration: 2, ease: "easeOut", delay: i * 0.2 }}
                       strokeLinecap="round" 
                       transform="rotate(-90 120 120)" 
                     />
                     <text x="120" y={120 - radii[i] + 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">{r.value}%</text>
                   </g>
                 )
              })}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
             {riskData.map((r, i) => (
               <div key={r.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-3xl text-center group/card hover:border-slate-600 transition-all duration-300">
                  <div className="w-3 h-3 rounded-full mb-2 mx-auto" style={{ backgroundColor: r.fill }} />
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">{r.name}</p>
                  <p className="text-xl font-black text-white">{r.value}%</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: THE ACTION PLAN - WHAT YOU NEED TO DO */}
      <div className="p-12 md:p-16 rounded-[64px] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20 border-2 border-slate-800 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 p-48 bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-48 bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="flex flex-col xl:flex-row items-start justify-between gap-12 mb-16 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400 uppercase tracking-[0.2em] font-black">
               <Stethoscope className="w-4 h-4" /> Recalibration Protocol
            </div>
            <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">Strategic<br />Action Plan</h3>
            <p className="text-slate-400 font-light text-xl leading-relaxed">Exact clinical steps you must execute to optimize your biometric architecture.</p>
          </div>

          <div className="flex gap-8">
            <div className="p-8 bg-slate-900/80 rounded-[40px] border border-slate-800 flex flex-col items-center min-w-[160px] shadow-2xl group hover:border-cyan-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-cyan-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">Priority</span>
              <span className="text-lg font-black text-white uppercase mt-1">High</span>
            </div>
            <div className="p-8 bg-slate-900/80 rounded-[40px] border border-slate-800 flex flex-col items-center min-w-[160px] shadow-2xl group hover:border-rose-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7 text-rose-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">Complexity</span>
              <span className="text-lg font-black text-white uppercase mt-1">Mid</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
          {/* Main Action Steps */}
          <div className="xl:col-span-7 space-y-8">
             <div className="flex items-center gap-3 border-l-2 border-indigo-500 pl-6 mb-8">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocol Execution Steps</h4>
             </div>
             <div className="space-y-2">
                {parseMarkdown(result.intervention_plan)}
             </div>
          </div>

          {/* Context & Support */}
          <div className="xl:col-span-5 space-y-10">
             <div className="p-10 bg-slate-950/80 rounded-[48px] border border-slate-800/80 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-black flex items-center gap-3 mb-6">
                   <Info className="w-4 h-4" /> Why this plan?
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed font-light italic">
                   {result.evidence || "Our neural engine synthesized this plan based on pattern variance detected in your blood pressure and lifestyle data."}
                </p>
             </div>

             <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Apple, label: 'Dietary', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: Dumbbell, label: 'Physical', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map((f, i) => (
                  <div key={i} className="p-8 bg-slate-900/60 rounded-[40px] border border-slate-800 text-center hover:border-slate-700 transition-all">
                     <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <f.icon className={`w-7 h-7 ${f.color}`} />
                     </div>
                     <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">{f.label}</p>
                     <p className="text-sm font-black text-white uppercase mt-1">Focused</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Compliance / Legal */}
      <div className="p-10 bg-slate-950/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row items-center gap-10 opacity-70 hover:opacity-100 transition-opacity">
        <Shield className="w-10 h-10 text-emerald-500 flex-shrink-0 animate-pulse" />
        <div className="space-y-2 text-center md:text-left">
           <p className="text-[11px] text-emerald-500 font-mono uppercase tracking-[0.2em] font-black">Security Protocol Finalized</p>
           <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-mono tracking-widest">
             Biometric analysis concluded. This output is a probabilistic projection and not a clinical diagnosis. Strategic implementation must be verified by a licensed healthcare operative.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
