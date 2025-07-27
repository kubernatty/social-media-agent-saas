import { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    timezone: 'America/New_York',
    postingSchedule: 'optimal',
    notifications: {
      email: true,
      push: false,
      analytics: true
    },
    integrations: {
      linkedin: true,
      twitter: false,
      facebook: false
    },
    aiPreferences: {
      tone: 'professional',
      contentLength: 'medium',
      hashtagCount: 3
    }
  });

  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingSettings, setSchedulingSettings] = useState({
    timezone: 'America/New_York',
    enabledDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    timeSlots: [
      { enabled: true, time: '09:00' },
      { enabled: true, time: '13:00' },
      { enabled: false, time: '17:00' }
    ]
  });

  // Load scheduling settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aifluence_scheduling_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSchedulingSettings(parsed);
      } catch (e) {
        console.error('Error loading scheduling settings:', e);
      }
    }
  }, []);

  // Save scheduling settings to localStorage
  const saveSchedulingSettings = (newSettings) => {
    setSchedulingSettings(newSettings);
    localStorage.setItem('aifluence_scheduling_settings', JSON.stringify(newSettings));
  };

  // Timezone helper functions
  const getCurrentTimeInTimezone = (timezone) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Invalid timezone';
    }
  };

  const getTimezoneAbbreviation = (timezone) => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      });
      const parts = formatter.formatToParts(date);
      return parts.find(part => part.type === 'timeZoneName')?.value || timezone;
    } catch (e) {
      return timezone;
    }
  };

  // Scheduling modal functions
  const openSchedulingModal = () => {
    setShowSchedulingModal(true);
  };

  const closeSchedulingModal = () => {
    setShowSchedulingModal(false);
  };

  const updateDayEnabled = (day, enabled) => {
    const newSettings = {
      ...schedulingSettings,
      enabledDays: {
        ...schedulingSettings.enabledDays,
        [day]: enabled
      }
    };
    saveSchedulingSettings(newSettings);
  };

  const updateTimeSlot = (index, field, value) => {
    const newTimeSlots = [...schedulingSettings.timeSlots];
    newTimeSlots[index] = {
      ...newTimeSlots[index],
      [field]: value
    };
    const newSettings = {
      ...schedulingSettings,
      timeSlots: newTimeSlots
    };
    saveSchedulingSettings(newSettings);
  };

  const updateSchedulingTimezone = (timezone) => {
    const newSettings = {
      ...schedulingSettings,
      timezone: timezone
    };
    saveSchedulingSettings(newSettings);
  };

  const applyPreset = (preset) => {
    let newSettings = { ...schedulingSettings };
    
    switch (preset) {
      case 'business':
        newSettings.enabledDays = {
          monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
          saturday: false, sunday: false
        };
        newSettings.timeSlots = [
          { enabled: true, time: '09:00' },
          { enabled: true, time: '13:00' },
          { enabled: true, time: '17:00' }
        ];
        break;
      case 'linkedin':
        newSettings.enabledDays = {
          monday: true, tuesday: true, wednesday: true, thursday: true, friday: false,
          saturday: false, sunday: false
        };
        newSettings.timeSlots = [
          { enabled: true, time: '08:00' },
          { enabled: true, time: '12:00' },
          { enabled: false, time: '17:00' }
        ];
        break;
      case 'minimal':
        newSettings.enabledDays = {
          monday: false, tuesday: true, wednesday: false, thursday: true, friday: false,
          saturday: false, sunday: false
        };
        newSettings.timeSlots = [
          { enabled: true, time: '10:00' },
          { enabled: false, time: '13:00' },
          { enabled: false, time: '17:00' }
        ];
        break;
    }
    
    saveSchedulingSettings(newSettings);
  };

  const resetSchedulingSettings = () => {
    const defaultSettings = {
      timezone: 'America/New_York',
      enabledDays: {
        monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
        saturday: false, sunday: false
      },
      timeSlots: [
        { enabled: true, time: '09:00' },
        { enabled: true, time: '13:00' },
        { enabled: false, time: '17:00' }
      ]
    };
    saveSchedulingSettings(defaultSettings);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateSimpleSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Settings</h2>

      <div className="space-y-8">
        {/* General Settings */}
        <section>
          <h3 className="text-lg font-semibold text-dark-text mb-4">⚙️ General Settings</h3>
          <div className="bg-dark-primary border border-dark-border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSimpleSetting('timezone', e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Default Posting Schedule</label>
              <select
                value={settings.postingSchedule}
                onChange={(e) => updateSimpleSetting('postingSchedule', e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
              >
                <option value="optimal">🎯 Optimal Timing</option>
                <option value="immediate">⚡ Immediate</option>
                <option value="custom">🕐 Custom Schedule</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-lg font-semibold text-dark-text mb-4">🔔 Notifications</h3>
          <div className="bg-dark-primary border border-dark-border rounded-lg p-4 space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <span className="text-dark-text capitalize">
                    {key === 'email' ? '📧 Email Notifications' : 
                     key === 'push' ? '📱 Push Notifications' : 
                     '📊 Analytics Reports'}
                  </span>
                  <p className="text-sm text-dark-text-muted">
                    {key === 'email' ? 'Receive email updates about your content' :
                     key === 'push' ? 'Get push notifications on your device' :
                     'Weekly analytics and performance reports'}
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('notifications', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-aifluence-600' : 'bg-dark-border'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-lg font-semibold text-dark-text mb-4">🔗 Platform Integrations</h3>
          <div className="bg-dark-primary border border-dark-border rounded-lg p-4 space-y-4">
            {Object.entries(settings.integrations).map(([platform, connected]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    platform === 'linkedin' ? 'bg-blue-600/20' :
                    platform === 'twitter' ? 'bg-sky-600/20' :
                    'bg-blue-800/20'
                  }`}>
                    {platform === 'linkedin' ? '💼' : platform === 'twitter' ? '🐦' : '📘'}
                  </div>
                  <div>
                    <span className="text-dark-text capitalize font-medium">{platform}</span>
                    <p className="text-sm text-dark-text-muted">
                      {connected ? 'Connected and active' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {connected && (
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                      Connected
                    </span>
                  )}
                  <button
                    onClick={() => updateSetting('integrations', platform, !connected)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      connected
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        : 'bg-aifluence-600 text-white hover:bg-aifluence-700'
                    }`}
                  >
                    {connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Preferences */}
        <section>
          <h3 className="text-lg font-semibold text-dark-text mb-4">🤖 AI Content Preferences</h3>
          <div className="bg-dark-primary border border-dark-border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Default Tone</label>
              <select
                value={settings.aiPreferences.tone}
                onChange={(e) => updateSetting('aiPreferences', 'tone', e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
              >
                <option value="professional">🎯 Professional</option>
                <option value="friendly">😊 Friendly</option>
                <option value="authoritative">💼 Authoritative</option>
                <option value="casual">🌟 Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Content Length</label>
              <select
                value={settings.aiPreferences.contentLength}
                onChange={(e) => updateSetting('aiPreferences', 'contentLength', e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
              >
                <option value="short">📝 Short (100-200 words)</option>
                <option value="medium">📄 Medium (200-400 words)</option>
                <option value="long">📰 Long (400+ words)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Default Hashtag Count</label>
              <select
                value={settings.aiPreferences.hashtagCount}
                onChange={(e) => updateSetting('aiPreferences', 'hashtagCount', parseInt(e.target.value))}
                className="w-full md:w-auto px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
              >
                <option value={0}>0 hashtags</option>
                <option value={3}>3 hashtags</option>
                <option value={5}>5 hashtags</option>
                <option value={10}>10 hashtags</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-gradient-to-r from-aifluence-600 to-purple-600 hover:from-aifluence-700 hover:to-purple-700 text-white rounded-lg transition-colors font-medium">
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}