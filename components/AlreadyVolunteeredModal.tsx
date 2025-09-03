'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface AlreadyVolunteeredModalProps {
  isOpen: boolean
  onClose: () => void
  taskName: string
}

export default function AlreadyVolunteeredModal({
  isOpen,
  onClose,
  taskName
}: AlreadyVolunteeredModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-orange-100" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              {/* Info Icon */}
              <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-3" dir="rtl">
                لقد اخترت الخدمة بالفعل!
              </h2>
              
              <p className="text-lg text-slate-600 mb-8" dir="rtl">
                أنت مسجل بالفعل للمساعدة في <span className="font-bold text-orange-600">{taskName}</span>!
                <br />
                <span className="text-base text-slate-500 mt-2 block">
                  شكراً لك على كونك متطوعاً رائعاً!
                </span>
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
              >
                فهمت!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}