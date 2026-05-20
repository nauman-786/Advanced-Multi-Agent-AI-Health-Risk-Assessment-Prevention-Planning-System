'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUploadIcon, FileText, CheckCircle2 } from 'lucide-react';

interface ImageDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  loading?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFilesAccepted,
  loading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
    disabled: loading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 ${
          isDragActive
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02] shadow-[0_0_30px_rgba(6,182,212,0.2)]'
            : 'border-slate-800 bg-slate-900/40 hover:border-cyan-500/30'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <input {...getInputProps()} />

        <div className="relative z-10 flex flex-col items-center justify-center p-8 min-h-[240px]">
          <motion.div
            animate={isDragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
            className={`p-4 rounded-2xl ${isDragActive ? 'bg-cyan-500 text-white' : 'bg-slate-950 text-slate-500 group-hover:text-cyan-400'} mb-6 transition-colors`}
          >
            <CloudUploadIcon className="w-8 h-8" />
          </motion.div>

          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-white tracking-tight">
              {isDragActive ? 'Release to upload' : 'Sync Medical Data'}
            </h4>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Drag images or <span className="text-cyan-500">browse file-system</span>
            </p>
          </div>

          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-wrap justify-center gap-2"
              >
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full"
                  >
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-mono text-cyan-400">{file.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ImageDropzone;
