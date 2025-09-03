'use client'

import { motion } from 'framer-motion'
import { Task } from '@/lib/supabase'

interface TaskCardProps {
  task: Task
  volunteerCount: number
  onClick: () => void
  delay?: number
  disabled?: boolean
}

export default function TaskCard({ 
  task, 
  volunteerCount, 
  onClick, 
  delay = 0,
  disabled = false 
}: TaskCardProps) {
  const isComplete = volunteerCount >= task.max_volunteers
  const progressPercentage = Math.min((volunteerCount / task.max_volunteers) * 100, 100)
  
  const gradients = [
    'bg-gradient-to-br from-indigo-500 to-violet-600',
    'bg-gradient-to-br from-sky-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-fuchsia-500 to-pink-600',
    'bg-gradient-to-br from-lime-500 to-green-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-cyan-500 to-sky-600'
  ]
  
  const colorIndex = task.name.length % gradients.length
  const gradientClass = gradients[colorIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      dir="rtl"
      className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} ${gradientClass} ring-1 ring-white/10`}
      onClick={disabled ? undefined : onClick}
    >
      
      {/* Content */}
      <div className="relative z-10 p-6 text-center">

        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg" dir="rtl">
          {task.name}
        </h3>
        
        {task.subtitle && (
          <p className="text-sm text-white/80 mb-4 drop-shadow" dir="rtl">
            {task.subtitle}
          </p>
        )}

        {/* Progress Section */}
        <div className="mb-4">
          {/* Count Display */}
          <div className="text-center mb-3">
            <span className="text-lg font-bold text-white drop-shadow-lg" dir="rtl">
              {volunteerCount}/{task.max_volunteers} خادم
            </span>
          </div>
          
          {/* Progress Bar */}
          <div
            className="w-full bg-white/25 rounded-full h-2.5 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={task.max_volunteers}
            aria-valuenow={volunteerCount}
          >
            <div
              className="h-full bg-white/90 rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Button or Status */}
        <div className="text-center">
          {isComplete ? (
            <div className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                اكتمل! شكراً للجميع!
              </span>
            </div>
          ) : disabled ? (
            <div className="bg-white/30 text-white font-bold py-3 px-6 rounded-xl">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                انت اخترت الخدمة بالفعل!
              </span>
            </div>
          ) : (
            <div className="bg-white/95 hover:bg-white text-slate-800 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                أريد أن اخدم!
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  )
}