'use client';

import { useState } from 'react';

interface PlanSetupProps {
  onCreatePlan: (duration: number) => void;
  onShowSavedPlans: () => void;
}

export default function PlanSetup({ onCreatePlan, onShowSavedPlans }: PlanSetupProps) {
  const [duration, setDuration] = useState(90);
  const [customDuration, setCustomDuration] = useState('');

  const presetDurations = [
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
    { label: '180 Days', value: 180 },
    { label: '365 Days', value: 365 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDuration = customDuration ? parseInt(customDuration) : duration;
    if (finalDuration > 0) {
      onCreatePlan(finalDuration);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md border dark:border-gray-700 transition-colors">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="text-yellow-500 font-bold text-lg">Uniqwrites</span>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <span className="text-gray-700 dark:text-gray-300">Bible Study</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bible Study Plan</h1>
          <p className="text-gray-600 dark:text-gray-400">Create your personalized Bible reading journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose your reading duration:
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {presetDurations.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setDuration(preset.value);
                    setCustomDuration('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    duration === preset.value && !customDuration
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="number"
                placeholder="Custom duration (days)"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 transition-colors">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Your plan will include:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• History books (Genesis to Job)</li>
              <li>• Psalms</li>
              <li>• Wisdom literature (Proverbs to Song of Songs)</li>
              <li>• Prophets (Isaiah to Malachi)</li>
              <li>• New Testament (Matthew to Jude)</li>
              <li>• Revelation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Create My Study Plan
            </button>
            
            <button
              type="button"
              onClick={onShowSavedPlans}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
            >
              Show Saved Plans
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
