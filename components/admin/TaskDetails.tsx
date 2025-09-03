'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task, Volunteer } from '@/lib/supabase'
import { X, Edit2, Check, Users, Calendar } from 'lucide-react'

interface TaskDetailsProps {
  task: Task
  volunteers: Volunteer[]
  onDeleteVolunteer: (volunteerId: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export default function TaskDetails({
  task,
  volunteers,
  onDeleteVolunteer,
  onUpdateTask
}: TaskDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(task.name)
  const [editMaxVolunteers, setEditMaxVolunteers] = useState(task.max_volunteers)

  const handleSaveEdit = () => {
    if (editName.trim() && editMaxVolunteers > 0) {
      onUpdateTask(task.id, {
        name: editName.trim(),
        max_volunteers: editMaxVolunteers
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditName(task.name)
    setEditMaxVolunteers(task.max_volunteers)
    setIsEditing(false)
  }

  const handleDeleteVolunteer = (volunteerId: string, volunteerName: string) => {
    if (confirm(`Remove ${volunteerName} from this task?`)) {
      onDeleteVolunteer(volunteerId)
    }
  }

  const isComplete = volunteers.length >= task.max_volunteers
  const progressPercentage = Math.min((volunteers.length / task.max_volunteers) * 100, 100)

  return (
    <div className="bg-white rounded-2xl p-6 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:border-primary-500 focus:outline-none"
                placeholder="Task name"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Max volunteers:</label>
                <input
                  type="number"
                  value={editMaxVolunteers}
                  onChange={(e) => setEditMaxVolunteers(parseInt(e.target.value) || 0)}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 w-24 focus:border-primary-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {task.name}
              </h2>
              <p className="text-gray-600">
                Max volunteers: {task.max_volunteers}
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEdit}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Save changes"
              >
                <Check size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Cancel"
              >
                <X size={20} />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 size={20} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className={`text-sm font-bold ${
            isComplete ? 'text-green-600' : 'text-primary-600'
          }`}>
            {volunteers.length}/{task.max_volunteers} volunteers
          </span>
        </div>
        
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isComplete ? 'bg-green-500' : 'bg-primary-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-3 text-green-600 font-medium"
          >
            🎉 Task Complete! Thanks everyone! 🎉
          </motion.div>
        )}
      </div>

      {/* Volunteers List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={20} />
          Volunteers ({volunteers.length})
        </h3>
        
        {volunteers.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {volunteers.map((volunteer, index) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-xl p-4 group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">
                        {volunteer.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(volunteer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteVolunteer(volunteer.id, volunteer.name)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove volunteer"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <p>No volunteers yet</p>
              <p className="text-sm">They'll appear here when kids sign up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}