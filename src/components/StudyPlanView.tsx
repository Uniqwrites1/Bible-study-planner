'use client';

import { useState, useEffect } from 'react';
import { StudyPlan, DailyReading } from '@/types/bible';
import { saveProgress, loadProgress } from '@/utils/studyPlanGenerator';

interface StudyPlanViewProps {
  plan: StudyPlan;
  onBack: () => void;
}

export default function StudyPlanView({ plan, onBack }: StudyPlanViewProps) {
  const [progress, setProgress] = useState<{ [day: number]: boolean }>({});
  const [currentDay, setCurrentDay] = useState(1);
  const planId = `plan-${plan.duration}-days`;

  useEffect(() => {
    const savedProgress = loadProgress(planId);
    setProgress(savedProgress);
  }, [planId]);

  const toggleDayCompletion = (day: number) => {
    const newCompleted = !progress[day];
    const newProgress = { ...progress, [day]: newCompleted };
    setProgress(newProgress);
    saveProgress(planId, day, newCompleted);
  };

  const completedDays = Object.values(progress).filter(Boolean).length;
  const progressPercentage = (completedDays / plan.duration) * 100;

  const getSectionIcon = (sectionName: string) => {
    const icons: { [key: string]: string } = {
      'History': '📜',
      'Psalms': '🎵',
      'Wisdom': '💡',
      'Prophets': '📢',
      'New Testament': '✝️',
      'Revelation': '🌟'
    };
    return icons[sectionName] || '📖';
  };

  const getSectionColor = (sectionName: string) => {
    const colors: { [key: string]: string } = {
      'History': 'bg-amber-100 text-amber-800 border-amber-200',
      'Psalms': 'bg-purple-100 text-purple-800 border-purple-200',
      'Wisdom': 'bg-green-100 text-green-800 border-green-200',
      'Prophets': 'bg-red-100 text-red-800 border-red-200',
      'New Testament': 'bg-blue-100 text-blue-800 border-blue-200',
      'Revelation': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[sectionName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {plan.duration}-Day Bible Study Plan
                </h1>
                <p className="text-gray-600">
                  {completedDays} of {plan.duration} days completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Day Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Jump to Day:</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                Day {currentDay}
              </span>
              <button
                onClick={() => setCurrentDay(Math.min(plan.duration, currentDay + 1))}
                disabled={currentDay === plan.duration}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max={plan.duration}
            value={currentDay}
            onChange={(e) => setCurrentDay(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Current Day Reading */}
        {plan.dailyPlan[currentDay - 1] && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Day {currentDay} Reading</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progress[currentDay] || false}
                  onChange={() => toggleDayCompletion(currentDay)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as completed
                </span>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(plan.dailyPlan[currentDay - 1].sections).map(([sectionName, portion]) => (
                <div
                  key={sectionName}
                  className={`p-4 rounded-lg border-2 ${getSectionColor(sectionName)}`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg">{getSectionIcon(sectionName)}</span>
                    <h3 className="font-semibold">{sectionName}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {portion.books.map((book, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{book.book}</div>
                        {book.chapters && (
                          <div className="text-opacity-80">
                            Chapters: {book.chapters.join(', ')}
                          </div>
                        )}
                        {book.verses && (
                          <div className="text-opacity-80">
                            Verses: {book.verses}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs opacity-75">
                    ~{portion.versesCount} verses
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Days Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Days Overview</h2>
          <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-15">
            {plan.dailyPlan.map((day) => (
              <button
                key={day.day}
                onClick={() => setCurrentDay(day.day)}
                className={`w-10 h-10 rounded-lg text-xs font-medium transition-all ${
                  progress[day.day]
                    ? 'bg-green-500 text-white'
                    : currentDay === day.day
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
