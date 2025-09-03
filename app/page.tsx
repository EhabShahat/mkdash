'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Task, Volunteer } from '@/lib/supabase'
import { generateFingerprint } from '@/lib/fingerprint'
import { getGridClasses } from '@/lib/grid-calculator'
import TaskCard from '@/components/TaskCard'
import NameInput from '@/components/NameInput'
import ConfirmationModal from '@/components/ConfirmationModal'
import SuccessModal from '@/components/SuccessModal'
import AlreadyVolunteeredModal from '@/components/AlreadyVolunteeredModal'
import InstructionsModal from '@/components/InstructionsModal'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [userName, setUserName] = useState('')
  const [userFingerprint, setUserFingerprint] = useState('')
  const [existingVolunteer, setExistingVolunteer] = useState<Volunteer | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAlreadyVolunteered, setShowAlreadyVolunteered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fingerprintingEnabled, setFingerprintingEnabled] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)
  const [instructionsText, setInstructionsText] = useState('')
  const [instructionsAgreed, setInstructionsAgreed] = useState(false)

  useEffect(() => {
    initializeApp()
    setupRealtimeSubscriptions()
  }, [])

  const initializeApp = async () => {
    try {
      const fingerprint = await generateFingerprint()
      setUserFingerprint(fingerprint)
      
      await Promise.all([
        fetchTasks(),
        fetchVolunteers(),
        fetchSettings(),
        fetchInstructions(),
        checkExistingVolunteer(fingerprint)
      ])
    } catch (error) {
      console.error('Error initializing app:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  const fetchVolunteers = async () => {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
    
    if (error) {
      console.error('Error fetching volunteers:', error)
    } else {
      setVolunteers(data || [])
    }
  }

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'fingerprinting_enabled')
      .maybeSingle()
    
    if (error) {
      console.error('Error fetching settings:', error)
      return
    }
    setFingerprintingEnabled(Boolean(data?.value))
  }

  const fetchInstructions = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'instructions_text')
      .maybeSingle()
    
    if (error) {
      console.error('Error fetching instructions:', error)
      setInstructionsText('مرحباً بك في نظام التطوع\n\nيرجى قراءة التعليمات التالية بعناية:\n\n• يمكنك اختيار خدمة واحدة فقط للتطوع بها\n• يجب كتابة الاسم الثلاثي كاملاً\n• بمجرد التسجيل لا يمكن تغيير الخدمة\n• يرجى الالتزام بالمواعيد المحددة\n\nشكراً لك على رغبتك في التطوع ومساعدة المجتمع')
      return
    }
    setInstructionsText((data?.value as string) || 'تعليمات النظام')
  }

  const checkExistingVolunteer = async (fingerprint: string) => {
    // Only check for existing volunteer if fingerprinting is enabled
    if (!fingerprintingEnabled) return
    
    const { data, error } = await supabase
      .from('volunteers')
      .select('*, tasks(name)')
      .eq('device_fingerprint', fingerprint)
    
    if (data && data.length > 0 && !error) {
      setExistingVolunteer(data[0])
      setShowAlreadyVolunteered(true)
    }
  }

  const setupRealtimeSubscriptions = () => {
    const volunteersSubscription = supabase
      .channel('volunteers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteers' },
        () => fetchVolunteers()
      )
      .subscribe()

    const tasksSubscription = supabase
      .channel('tasks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => fetchTasks()
      )
      .subscribe()

    const settingsSubscription = supabase
      .channel('settings')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        () => fetchSettings()
      )
      .subscribe()

    return () => {
      volunteersSubscription.unsubscribe()
      tasksSubscription.unsubscribe()
      settingsSubscription.unsubscribe()
    }
  }

  const handleTaskSelect = (task: Task) => {
    // Only check existing volunteer if fingerprinting is enabled
    if (fingerprintingEnabled && existingVolunteer) {
      setShowAlreadyVolunteered(true)
      return
    }
    
    const taskVolunteers = volunteers.filter(v => v.task_id === task.id)
    if (taskVolunteers.length >= task.max_volunteers) {
      return // Task is full
    }
    
    setSelectedTask(task)
    setShowConfirmation(true)
  }

  const confirmVolunteer = async () => {
    if (!selectedTask || !userName.trim() || !userFingerprint) return

    try {
      const { error } = await supabase
        .from('volunteers')
        .insert({
          task_id: selectedTask.id,
          name: userName.trim(),
          device_fingerprint: fingerprintingEnabled ? userFingerprint : `${Date.now()}-${Math.random()}`
        })

      if (error) throw error

      setShowConfirmation(false)
      setShowSuccess(true)
      
      // Refresh data
      await Promise.all([
        fetchVolunteers(),
        checkExistingVolunteer(userFingerprint)
      ])
    } catch (error) {
      console.error('Error volunteering:', error)
    }
  }

  const getTaskVolunteerCount = (taskId: string) => {
    return volunteers.filter(v => v.task_id === taskId).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-slate-600 font-medium" dir="rtl">
            جاري التحميل...
          </p>
        </div>
      </div>
    )
  }

  if (showInstructions && !instructionsAgreed) {
    return (
      <InstructionsModal
        isOpen={true}
        onAgree={() => {
          setInstructionsAgreed(true)
          setShowInstructions(false)
        }}
        instructionsText={instructionsText}
      />
    )
  }

  if (!userName && !existingVolunteer) {
    return <NameInput onSubmit={setUserName} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
        }} />
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16" dir="rtl">
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 tracking-tight">
              اختر خدمتك
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              مرحباً <span className="font-bold text-blue-600">{existingVolunteer?.name || userName}</span>! اختر خدمتك
            </p>
            
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-8 rounded-full w-24" />
          </div>

          {/* Tasks Grid */}
          <div className={`grid gap-8 ${getGridClasses(tasks.length)} max-w-6xl mx-auto`}>
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                volunteerCount={getTaskVolunteerCount(task.id)}
                onClick={() => handleTaskSelect(task)}
                delay={0}
                disabled={fingerprintingEnabled && !!existingVolunteer}
              />
            ))}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-16 text-slate-500">
            <p className="text-sm" dir="rtl">
             ربنا يبارك اختيارك.
            </p>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmVolunteer}
        taskName={selectedTask?.name || ''}
        userName={userName}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        taskName={selectedTask?.name || ''}
      />

      <AlreadyVolunteeredModal
        isOpen={showAlreadyVolunteered}
        onClose={() => setShowAlreadyVolunteered(false)}
        taskName={existingVolunteer?.tasks?.name || ''}
      />
    </div>
  )
}