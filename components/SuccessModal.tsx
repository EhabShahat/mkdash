'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  taskName: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  taskName
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000) // Auto close after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-green-100" onClick={(e) => e.stopPropagation()}>
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                رائع!
              </h2>
              
              <p className="text-lg text-slate-600 mb-6" dir="rtl">
                لقد اخترت <span className="font-bold text-green-600">{taskName}</span>!
                <br />
                <span className="text-base text-slate-500 mt-1 block">
                  شكراً لك!
                </span>
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
              >
                ممتاز!
              </button>
            </div>
            
            {/* Auto-close indicator */}
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-3xl animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  )
}