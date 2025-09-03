'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Task, Volunteer } from '@/lib/supabase'
import TaskList from '@/components/admin/TaskList'
import TaskDetails from '@/components/admin/TaskDetails'
import AddTaskModal from '@/components/admin/AddTaskModal'
import SettingsModal from '@/components/admin/SettingsModal'
import { Plus, Download, RotateCcw, Settings, Shield, ShieldOff } from 'lucide-react'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fingerprintingEnabled, setFingerprintingEnabled] = useState(true)

  useEffect(() => {
    initializeDashboard()
    setupRealtimeSubscriptions()
  }, [])

  const initializeDashboard = async () => {
    try {
      await Promise.all([
        fetchTasks(),
        fetchVolunteers(),
        fetchSettings()
      ])
    } catch (error) {
      console.error('Error initializing dashboard:', error)
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
      if (data && data.length > 0 && !selectedTask) {
        setSelectedTask(data[0])
      }
    }
  }

  const fetchVolunteers = async () => {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
    
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

  const setupRealtimeSubscriptions = () => {
    const volunteersSubscription = supabase
      .channel('admin_volunteers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteers' },
        () => fetchVolunteers()
      )
      .subscribe()

    const tasksSubscription = supabase
      .channel('admin_tasks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => fetchTasks()
      )
      .subscribe()

    const settingsSubscription = supabase
      .channel('admin_settings')
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

  const handleAddTask = async (name: string, subtitle: string, maxVolunteers: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({ name, subtitle, max_volunteers: maxVolunteers })

      if (error) throw error
      
      setShowAddTask(false)
      await fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) throw error
      
      await fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteVolunteer = async (volunteerId: string) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', volunteerId)

      if (error) throw error
      
      await fetchVolunteers()
    } catch (error) {
      console.error('Error deleting volunteer:', error)
    }
  }

  const handleClearAllVolunteers = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('task_id', taskId)

      if (error) throw error
      
      await fetchVolunteers()
    } catch (error) {
      console.error('Error clearing volunteers:', error)
    }
  }

  const handleResetEverything = async () => {
    if (!confirm('Are you sure you want to reset everything? This will delete all tasks and volunteers!')) {
      return
    }

    try {
      await supabase.from('volunteers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      setSelectedTask(null)
      await Promise.all([fetchTasks(), fetchVolunteers()])
    } catch (error) {
      console.error('Error resetting data:', error)
    }
  }

  const exportTaskData = (task: Task) => {
    const taskVolunteers = volunteers.filter(v => v.task_id === task.id)
    const escapeCsv = (val: any) => {
      const s = String(val ?? '')
      return '"' + s.replace(/"/g, '""') + '"'
    }
    const rows = [
      ['Name', 'Joined At'],
      ...taskVolunteers.map(v => [v.name, new Date(v.created_at).toLocaleString()])
    ]
    const csvContent = rows.map(row => row.map(escapeCsv).join(',')).join('\r\n')
    // Add UTF-8 BOM for proper Arabic text display in Excel
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csvContent

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const safeName = task.name
      .replace(/[\\\/:*?"<>|]/g, '') // remove Windows-invalid chars
      .replace(/\s+/g, '_')
      .trim()
    a.download = `${safeName || 'task'}_volunteers.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAllTasksData = () => {
    const escapeCsv = (val: any) => {
      const s = String(val ?? '')
      return '"' + s.replace(/"/g, '""') + '"'
    }
    const rows = [
      ['Task Name', 'Task Subtitle', 'Max Volunteers', 'Current Volunteers', 'Volunteer Names', 'Created At'],
      ...tasks.map(task => {
        const taskVolunteers = volunteers.filter(v => v.task_id === task.id)
        const volunteerNames = taskVolunteers.map(v => v.name).join('; ')
        return [
          task.name,
          task.subtitle || '',
          task.max_volunteers.toString(),
          taskVolunteers.length.toString(),
          volunteerNames,
          new Date(task.created_at).toLocaleString()
        ]
      })
    ]
    const csvContent = rows.map(row => row.map(escapeCsv).join(',')).join('\r\n')
    // Add UTF-8 BOM for proper Arabic text display in Excel
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csvContent

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all_tasks_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTaskVolunteers = (taskId: string) => {
    return volunteers.filter(v => v.task_id === taskId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Volunteer Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage tasks and volunteers
                </p>
                <div className={`
                  flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit
                  ${fingerprintingEnabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                  }
                `}>
                  {fingerprintingEnabled ? (
                    <>
                      <Shield size={12} className="sm:w-[14px] sm:h-[14px]" />
                      <span className="hidden sm:inline">One task per kid</span>
                      <span className="sm:hidden">1 task/kid</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff size={12} className="sm:w-[14px] sm:h-[14px]" />
                      <span className="hidden sm:inline">Multiple tasks allowed</span>
                      <span className="sm:hidden">Multi tasks</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportAllTasksData}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors"
              >
                <Download size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Export All Tasks</span>
                <span className="sm:hidden">Export</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors"
              >
                <Settings size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 btn-primary text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium"
              >
                <Plus size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetEverything}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 btn-danger text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium"
              >
                <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Reset All</span>
                <span className="sm:hidden">Reset</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-200px)]">
          {/* Task List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <TaskList
              tasks={tasks}
              volunteers={volunteers}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
              onUpdateTask={handleUpdateTask}
              onClearVolunteers={handleClearAllVolunteers}
              onExportTask={exportTaskData}
            />
          </div>

          {/* Task Details */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedTask ? (
              <TaskDetails
                task={selectedTask}
                volunteers={getTaskVolunteers(selectedTask.id)}
                onDeleteVolunteer={handleDeleteVolunteer}
                onUpdateTask={handleUpdateTask}
              />
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-6xl mb-4">📋</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600">
                  Select a task to view details
                </h3>
                <p className="text-sm text-gray-500 mt-2 lg:hidden">
                  Scroll down to see task list
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAdd={handleAddTask}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}