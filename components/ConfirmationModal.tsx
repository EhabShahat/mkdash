'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskName: string
  userName: string
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  taskName,
  userName
}: ConfirmationModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-blue-100" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              {/* Question Icon */}
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-3" dir="rtl">
                هل أنت متأكد يا، {userName}؟
              </h2>
              
              <p className="text-lg text-slate-600 mb-8" dir="rtl">
                هل تريد المساعدة في <span className="font-bold text-blue-600">{taskName}</span>؟
                <br />
                <span className="text-sm text-slate-500 mt-2 block">
                  تذكر، يمكنك اختيار مهمة واحدة فقط للمساعدة بها!
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors duration-200"
                >
                  ربما لاحقاً
                </button>
                
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
                >
                  نعم، اختر!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}