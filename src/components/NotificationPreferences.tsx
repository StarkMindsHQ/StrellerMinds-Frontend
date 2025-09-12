'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Bell, Mail, Smartphone, Globe } from 'lucide-react'

interface NotificationSettings {
  emailNotifications: {
    promotional: boolean
    transactional: boolean
    courseUpdates: boolean
    newsletter: boolean
  }
  inAppNotifications: {
    assignments: boolean
    messages: boolean
    announcements: boolean
    reminders: boolean
  }
  pushNotifications: {
    enabled: boolean
    courseDeadlines: boolean
    newMessages: boolean
    systemUpdates: boolean
  }
}

interface NotificationToggleProps {
  id: string
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  icon?: React.ReactNode
  disabled?: boolean
}

function NotificationToggle({ id, title, description, checked, onChange, icon, disabled = false }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-300">
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-[#5c0f49] mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5c0f49]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#5c0f49] peer-checked:to-purple-600 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}></div>
      </label>
    </div>
  )
}

export default function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      promotional: true,
      transactional: true,
      courseUpdates: true,
      newsletter: false
    },
    inAppNotifications: {
      assignments: true,
      messages: true,
      announcements: true,
      reminders: false
    },
    pushNotifications: {
      enabled: false,
      courseDeadlines: false,
      newMessages: false,
      systemUpdates: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (category: keyof NotificationSettings, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setHasChanges(true)
    
    // Clear success state when user makes changes
    if (isSuccess) {
      setIsSuccess(false)
    }
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      setIsSuccess(true)
      setHasChanges(false)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
      
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl border border-purple-100">
        <h3 className="text-xl font-bold text-[#5c0f49] mb-6">Notification Preferences</h3>
        
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Preferences saved successfully!</p>
              <p className="text-green-600 text-sm">Your notification settings have been updated.</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-[#5c0f49]" />
              <h4 className="text-lg font-semibold text-[#5c0f49]">Email Notifications</h4>
            </div>
            <div className="space-y-4">
              <NotificationToggle
                id="promotional-emails"
                title="Promotional Emails"
                description="Receive updates about new courses, special offers, and promotions"
                checked={settings.emailNotifications.promotional}
                onChange={(checked) => updateSetting('emailNotifications', 'promotional', checked)}
                icon={<Mail className="h-4 w-4 text-purple-500" />}
              />
              
              <NotificationToggle
                id="transactional-emails"
                title="Transactional Emails"
                description="Important account and course-related notifications (recommended)"
                checked={settings.emailNotifications.transactional}
                onChange={(checked) => updateSetting('emailNotifications', 'transactional', checked)}
                icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
              />
              
              <NotificationToggle
                id="course-updates"
                title="Course Updates"
                description="Notifications about course progress, assignments, and deadlines"
                checked={settings.emailNotifications.courseUpdates}
                onChange={(checked) => updateSetting('emailNotifications', 'courseUpdates', checked)}
                icon={<Bell className="h-4 w-4 text-blue-500" />}
              />
              
              <NotificationToggle
                id="newsletter"
                title="Newsletter"
                description="Weekly digest of platform updates and educational content"
                checked={settings.emailNotifications.newsletter}
                onChange={(checked) => updateSetting('emailNotifications', 'newsletter', checked)}
                icon={<Globe className="h-4 w-4 text-green-500" />}
              />
            </div>
          </div>

          {/* In-App Notifications */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-[#5c0f49]" />
              <h4 className="text-lg font-semibold text-[#5c0f49]">In-App Notifications</h4>
            </div>
            <div className="space-y-4">
              <NotificationToggle
                id="assignments"
                title="Assignment Notifications"
                description="Get notified about new assignments and submission deadlines"
                checked={settings.inAppNotifications.assignments}
                onChange={(checked) => updateSetting('inAppNotifications', 'assignments', checked)}
                icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
              />
              
              <NotificationToggle
                id="messages"
                title="Messages"
                description="Notifications for new messages from instructors and peers"
                checked={settings.inAppNotifications.messages}
                onChange={(checked) => updateSetting('inAppNotifications', 'messages', checked)}
                icon={<Mail className="h-4 w-4 text-blue-500" />}
              />
              
              <NotificationToggle
                id="announcements"
                title="Announcements"
                description="Important announcements from course instructors and platform"
                checked={settings.inAppNotifications.announcements}
                onChange={(checked) => updateSetting('inAppNotifications', 'announcements', checked)}
                icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
              />
              
              <NotificationToggle
                id="reminders"
                title="Study Reminders"
                description="Gentle reminders to help you stay on track with your learning"
                checked={settings.inAppNotifications.reminders}
                onChange={(checked) => updateSetting('inAppNotifications', 'reminders', checked)}
                icon={<Bell className="h-4 w-4 text-purple-500" />}
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-5 w-5 text-[#5c0f49]" />
              <h4 className="text-lg font-semibold text-[#5c0f49]">Push Notifications</h4>
            </div>
            <div className="space-y-4">
              <NotificationToggle
                id="push-enabled"
                title="Enable Push Notifications"
                description="Allow the app to send push notifications to your device"
                checked={settings.pushNotifications.enabled}
                onChange={(checked) => updateSetting('pushNotifications', 'enabled', checked)}
                icon={<Smartphone className="h-4 w-4 text-indigo-500" />}
              />
              
              <NotificationToggle
                id="course-deadlines"
                title="Course Deadlines"
                description="Push notifications for upcoming assignment and course deadlines"
                checked={settings.pushNotifications.courseDeadlines}
                onChange={(checked) => updateSetting('pushNotifications', 'courseDeadlines', checked)}
                icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                disabled={!settings.pushNotifications.enabled}
              />
              
              <NotificationToggle
                id="new-messages-push"
                title="New Messages"
                description="Instant notifications for new messages and communications"
                checked={settings.pushNotifications.newMessages}
                onChange={(checked) => updateSetting('pushNotifications', 'newMessages', checked)}
                icon={<Mail className="h-4 w-4 text-blue-500" />}
                disabled={!settings.pushNotifications.enabled}
              />
              
              <NotificationToggle
                id="system-updates"
                title="System Updates"
                description="Important platform updates and maintenance notifications"
                checked={settings.pushNotifications.systemUpdates}
                onChange={(checked) => updateSetting('pushNotifications', 'systemUpdates', checked)}
                icon={<Globe className="h-4 w-4 text-gray-500" />}
                disabled={!settings.pushNotifications.enabled}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-purple-100">
            <Button 
              onClick={handleSaveChanges}
              disabled={isLoading || !hasChanges}
              className="bg-gradient-to-r from-[#ffcc00] to-yellow-400 hover:from-yellow-400 hover:to-[#ffcc00] text-[#5c0f49] font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#5c0f49]/30 border-t-[#5c0f49] rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </div>
              ) : (
                'Save Preferences'
              )}
            </Button>
            
            {!hasChanges && !isLoading && (
              <p className="text-sm text-gray-500 mt-2">No changes to save</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
