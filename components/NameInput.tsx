'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NameInputProps {
  onSubmit: (name: string) => void
}

export default function NameInput({ onSubmit }: NameInputProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const nameParts = trimmedName.split(/\s+/)
    
    if (nameParts.length >= 3 && trimmedName) {
      onSubmit(trimmedName)
    }
  }

  const isValidName = () => {
    const trimmedName = name.trim()
    const nameParts = trimmedName.split(/\s+/)
    return nameParts.length >= 3 && trimmedName.length > 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
        }} />
      </div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl border border-white/20">
        {/* Welcome Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center shadow-xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" dir="rtl">
            مرحباً بك!
          </h1>
          <p className="text-xl text-slate-600 font-medium" dir="rtl">
            يرجى كتابة اسمك الثلاثي كاملاً
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الأول الأوسط الأخير"
                dir="rtl"
                className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-lg ${
                  name.trim() && !isValidName() 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
                autoFocus
              />
              {/* Input Icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            {name.trim() && !isValidName() && (
              <p className="text-red-500 text-sm mt-3 text-right bg-red-50 p-3 rounded-xl border border-red-200" dir="rtl">
                يرجى كتابة الاسم الثلاثي كاملاً
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValidName()}
            className="w-full py-4 text-xl font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-3">
              متابعة
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}