'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, subtitle: string, maxVolunteers: number) => void
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd
}: AddTaskModalProps) {
  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [maxVolunteers, setMaxVolunteers] = useState(20)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && subtitle.trim() && maxVolunteers > 0) {
      onAdd(name.trim(), subtitle.trim(), maxVolunteers)
      setName('')
      setSubtitle('')
      setMaxVolunteers(20)
    }
  }

  const handleClose = () => {
    setName('')
    setSubtitle('')
    setMaxVolunteers(20)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Beach Cleanup, Food Bank Helper..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Subtitle (Arabic)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., نظف الشاطئ واحم البيئة"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Volunteers
                </label>
                <input
                  type="number"
                  value={maxVolunteers}
                  onChange={(e) => setMaxVolunteers(parseInt(e.target.value) || 0)}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={!name.trim() || !subtitle.trim() || maxVolunteers <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 btn-primary text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}