'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RiskRingProps {
  disease: string;
  percentage: number;
  description?: string;
}

export const RiskRing: React.FC<RiskRingProps> = ({
  disease,
  percentage,
  description = '',
}) => {
  // Determine color based on risk level
  const getColor = (percent: number) => {
    if (percent >= 80) return 'from-red-500 to-red-600';
    if (percent >= 60) return 'from-orange-500 to-orange-600';
    if (percent >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getTextColor = (percent: number) => {
    if (percent >= 80) return 'text-red-400';
    if (percent >= 60) return 'text-orange-400';
    if (percent >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  // SVG Circle progress calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 rounded-lg bg-slate-900/50 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
    >
      <div className="relative w-32 h-32">
        <svg
          width="130"
          height="130"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(15, 23, 42, 0.6)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={`url(#gradient-${disease.toLowerCase().replace(/\s+/g, '-')})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${disease.toLowerCase().replace(/\s+/g, '-')}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={percentage >= 80 ? '#ef4444' : percentage >= 60 ? '#f97316' : percentage >= 40 ? '#eab308' : '#22c55e'}
              />
              <stop
                offset="100%"
                stopColor={percentage >= 80 ? '#7f1d1d' : percentage >= 60 ? '#7c2d12' : percentage >= 40 ? '#713f12' : '#15803d'}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className={`text-2xl font-bold ${getTextColor(percentage)}`}>
              {Math.round(percentage)}%
            </p>
          </motion.div>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white text-center">
        {disease}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-slate-300 text-center max-w-xs">
          {description}
        </p>
      )}

      {/* Risk level indicator */}
      <div className="mt-3 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
        <p className={`text-xs font-semibold ${getTextColor(percentage)}`}>
          {percentage >= 80
            ? '⚠️ High Risk'
            : percentage >= 60
            ? '⚡ Elevated'
            : percentage >= 40
            ? '⏱️ Moderate'
            : '✅ Low Risk'}
        </p>
      </div>
    </motion.div>
  );
};

interface RiskGridProps {
  risks: {
    diabetes: number;
    hypertension: number;
    cardiovascular: number;
  };
}

export const RiskGrid: React.FC<RiskGridProps> = ({ risks }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
    >
      <RiskRing
        disease="Diabetes"
        percentage={risks.diabetes}
        description="Based on blood sugar and lifestyle"
      />
      <RiskRing
        disease="Hypertension"
        percentage={risks.hypertension}
        description="Based on blood pressure and health factors"
      />
      <RiskRing
        disease="Cardiovascular"
        percentage={risks.cardiovascular}
        description="Based on cholesterol and vital signs"
      />
    </motion.div>
  );
};

export default RiskGrid;
