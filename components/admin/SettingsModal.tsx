'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, AppSetting } from '@/lib/supabase'
import { Settings, Shield, ShieldOff } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({
  isOpen,
  onClose
}: SettingsModalProps) {
  const [fingerprintingEnabled, setFingerprintingEnabled] = useState(true)
  const [appTitle, setAppTitle] = useState('Kids Volunteer Hub')
  const [instructionsText, setInstructionsText] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
      
      if (error) throw error
      
      data?.forEach((setting: AppSetting) => {
        if (setting.key === 'fingerprinting_enabled') {
          setFingerprintingEnabled(setting.value === true)
        } else if (setting.key === 'app_title') {
          setAppTitle(setting.value || 'Kids Volunteer Hub')
        } else if (setting.key === 'instructions_text') {
          setInstructionsText(setting.value || '')
        }
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
      
      if (error) throw error
    } catch (error) {
      console.error(`Error updating ${key}:`, error)
      throw error
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await Promise.all([
        updateSetting('fingerprinting_enabled', fingerprintingEnabled),
        updateSetting('app_title', appTitle),
        updateSetting('instructions_text', instructionsText)
      ])
      
      onClose()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-gray-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">
                App Settings
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* App Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Title
                  </label>
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Kids Volunteer Hub"
                  />
                </div>

                {/* Instructions Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تعليمات النظام (Instructions Text)
                  </label>
                  <textarea
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="أدخل تعليمات النظام هنا..."
                    rows={6}
                    dir="rtl"
                  />
                </div>

                {/* Device Fingerprinting Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Device Fingerprinting
                  </label>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {fingerprintingEnabled ? (
                          <Shield className="text-green-600" size={20} />
                        ) : (
                          <ShieldOff className="text-orange-600" size={20} />
                        )}
                        <span className="font-medium text-gray-800">
                          {fingerprintingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFingerprintingEnabled(!fingerprintingEnabled)}
                        className={`
                          relative w-12 h-6 rounded-full transition-colors duration-200
                          ${fingerprintingEnabled ? 'bg-green-500' : 'bg-gray-300'}
                        `}
                      >
                        <motion.div
                          animate={{ x: fingerprintingEnabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </motion.button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {fingerprintingEnabled ? (
                        <>
                          <strong>One task per kid:</strong> Each device can only volunteer for one task. 
                          Kids can't volunteer multiple times even after refreshing.
                        </>
                      ) : (
                        <>
                          <strong>Multiple volunteers allowed:</strong> Kids can volunteer for multiple tasks 
                          or volunteer again after refreshing the page.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 px-4 btn-primary text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}