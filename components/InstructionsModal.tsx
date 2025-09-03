'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface InstructionsModalProps {
  isOpen: boolean
  onAgree: () => void
  instructionsText: string
}

export default function InstructionsModal({
  isOpen,
  onAgree,
  instructionsText
}: InstructionsModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20" dir="rtl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center shadow-xl mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                تعليمات مهمة
              </h2>
              
              <p className="text-slate-600 font-medium">
                يرجى قراءة هذه التعليمات بعناية
              </p>
            </div>
            
            {/* Content */}
            <div className="text-right mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                  {instructionsText}
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                onClick={onAgree}
                className="w-full py-4 text-xl font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-xl transition-colors duration-300"
              >
                <span className="flex items-center justify-center gap-3">
                  أوافق على التعليمات
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
