'use client'

import { motion } from 'framer-motion'
import { Task, Volunteer } from '@/lib/supabase'
import { Edit2, Trash2, Download, Users } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  volunteers: Volunteer[]
  selectedTask: Task | null
  onSelectTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onClearVolunteers: (taskId: string) => void
  onExportTask: (task: Task) => void
}

export default function TaskList({
  tasks,
  volunteers,
  selectedTask,
  onSelectTask,
  onUpdateTask,
  onClearVolunteers,
  onExportTask
}: TaskListProps) {
  const getTaskVolunteerCount = (taskId: string) => {
    return volunteers.filter(v => v.task_id === taskId).length
  }

  const handleClearVolunteers = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation()
    if (confirm(`Clear all volunteers from "${task.name}"?`)) {
      onClearVolunteers(task.id)
    }
  }

  const handleExport = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation()
    onExportTask(task)
  }

  return (
    <div className="bg-white rounded-2xl p-6 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Users size={24} />
        Tasks ({tasks.length})
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.map((task, index) => {
          const volunteerCount = getTaskVolunteerCount(task.id)
          const isComplete = volunteerCount >= task.max_volunteers
          const isSelected = selectedTask?.id === task.id
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectTask(task)}
              className={`
                p-4 rounded-xl cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-primary-100 border-2 border-primary-300' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-gray-800" dir="rtl">
                    {task.name}
                  </h3>
                  {task.subtitle && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {task.subtitle}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleExport(e, task)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Export CSV"
                  >
                    <Download size={16} />
                  </button>
                  
                  <button
                    onClick={(e) => handleClearVolunteers(e, task)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Clear all volunteers"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isComplete ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((volunteerCount / task.max_volunteers) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${
                  isComplete ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {volunteerCount}/{task.max_volunteers} volunteers
                </span>
                
                {isComplete && (
                  <span className="text-green-600 font-medium">
                    Complete! 🎉
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p>No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>
    </div>
  )
}