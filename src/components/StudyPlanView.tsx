'use client';

import { useState, useEffect } from 'react';
import { StudyPlan, DayProgress } from '@/types/bible';
import { saveSectionProgress, loadSectionProgress } from '@/utils/studyPlanGenerator';
import { savePlanLocally } from '@/utils/exportUtils';
import { Save, Check, BookOpen } from 'lucide-react';
import BibleReadingModal from './BibleReadingModal';

interface StudyPlanViewProps {
  plan: StudyPlan;
  onBack: () => void;
  initialProgress?: DayProgress;
}

export default function StudyPlanView({ plan, onBack, initialProgress = {} }: StudyPlanViewProps) {
  const [sectionProgress, setSectionProgress] = useState<DayProgress>({});
  const [currentDay, setCurrentDay] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  const [selectedReading, setSelectedReading] = useState<{
    bookName: string;
    chapters?: number[];
    verses?: string;
    sectionName: string;
  } | null>(null);
  const [loadingReading, setLoadingReading] = useState<string | null>(null);
  const planId = `plan-${plan.duration}-days`;
  
  useEffect(() => {
    // Use initial progress if provided, otherwise load from storage
    if (Object.keys(initialProgress).length > 0) {
      setSectionProgress(initialProgress);
    } else {
      const savedProgress = loadSectionProgress(planId);
      setSectionProgress(savedProgress);
    }
  }, [planId, initialProgress]);
  const toggleSectionCompletion = (day: number, sectionName: string) => {
    const currentSectionProgress = sectionProgress[day]?.[sectionName] || false;
    const newCompleted = !currentSectionProgress;
    
    const newProgress = { ...sectionProgress };
    if (!newProgress[day]) {
      newProgress[day] = {};
    }
    newProgress[day][sectionName] = newCompleted;
    
    setSectionProgress(newProgress);
    saveSectionProgress(planId, day, sectionName, newCompleted);
  };

  const getDayCompletionStatus = (day: number): boolean => {
    const dayProgress = sectionProgress[day];
    if (!dayProgress) return false;
    
    const dailyReading = plan.dailyPlan[day - 1];
    if (!dailyReading) return false;
    
    const sectionNames = Object.keys(dailyReading.sections);
    return sectionNames.every(sectionName => dayProgress[sectionName] === true);
  };
  const getSectionCompletionCount = (): number => {
    let completedSections = 0;
    
    plan.dailyPlan.forEach((dailyReading) => {
      const sectionNames = Object.keys(dailyReading.sections);
      
      const dayProgress = sectionProgress[dailyReading.day];
      if (dayProgress) {
        sectionNames.forEach(sectionName => {
          if (dayProgress[sectionName]) {
            completedSections++;
          }
        });
      }
    });
    
    return completedSections;
  };

  const getTotalSectionCount = (): number => {
    return plan.dailyPlan.reduce((total, dailyReading) => {
      return total + Object.keys(dailyReading.sections).length;
    }, 0);
  };

  const completedDays = plan.dailyPlan.filter(day => getDayCompletionStatus(day.day)).length;
  const completedSections = getSectionCompletionCount();
  const totalSections = getTotalSectionCount();
  const progressPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

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
      'History': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700',
      'Psalms': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      'Wisdom': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
      'Prophets': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
      'New Testament': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      'Revelation': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
    };
    return colors[sectionName] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  };  const handleSavePlan = async () => {
    setIsLoading(true);
    try {
      savePlanLocally(plan, sectionProgress);
      setIsSaved(true);
      
      // Show success message for 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const handleReadingClick = (bookName: string, chapters?: number[], verses?: string, sectionName?: string) => {
    const readingKey = `${bookName}-${chapters?.join(',') || ''}-${verses || ''}`;
    setLoadingReading(readingKey);
    
    // Small delay to show loading state
    setTimeout(() => {
      setSelectedReading({
        bookName,
        chapters,
        verses,
        sectionName: sectionName || 'Bible Reading'
      });
      setLoadingReading(null);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                ← Back
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-yellow-500 font-semibold text-sm">Uniqwrites</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">|</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Bible Study</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.duration}-Day Bible Study Plan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {completedDays} of {plan.duration} days completed ({completedSections} of {totalSections} sections)
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Day Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jump to Day:</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded font-medium">
                Day {currentDay}
              </span>
              <button
                onClick={() => setCurrentDay(Math.min(plan.duration, currentDay + 1))}
                disabled={currentDay === plan.duration}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-50 transition-colors"
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
            className="w-full accent-blue-600 dark:accent-blue-500"
          />
        </div>

        {/* Current Day Reading */}
        {plan.dailyPlan[currentDay - 1] && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Day {currentDay} Reading</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getDayCompletionStatus(currentDay) ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Day Complete</span>
                ) : (
                  <span>
                    {Object.keys(plan.dailyPlan[currentDay - 1].sections).filter(
                      sectionName => sectionProgress[currentDay]?.[sectionName]
                    ).length} of {Object.keys(plan.dailyPlan[currentDay - 1].sections).length} sections completed
                  </span>
                )}
              </div>
            </div>

            {/* Instruction for Bible reading */}
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">
                  💡 Tip: Click on any Bible book to read the actual text in your preferred version
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(plan.dailyPlan[currentDay - 1].sections).map(([sectionName, portion]) => (
                <div
                  key={sectionName}
                  className={`p-4 rounded-lg border-2 transition-all ${getSectionColor(sectionName)} ${
                    sectionProgress[currentDay]?.[sectionName] ? 'ring-2 ring-green-500 dark:ring-green-400 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSectionIcon(sectionName)}</span>
                      <h3 className="font-semibold">{sectionName}</h3>
                    </div>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sectionProgress[currentDay]?.[sectionName] || false}
                        onChange={() => toggleSectionCompletion(currentDay, sectionName)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>                  <div className="space-y-2">                    {portion.books.map((book, index) => {
                      const readingKey = `${book.book}-${book.chapters?.join(',') || ''}-${book.verses || ''}`;
                      const isLoading = loadingReading === readingKey;
                      
                      return (
                        <div key={index} className="text-sm">
                          <button
                            onClick={() => handleReadingClick(book.book, book.chapters, book.verses, sectionName)}
                            className="w-full text-left p-2 rounded hover:bg-white hover:bg-opacity-50 transition-colors group border border-transparent hover:border-white hover:border-opacity-30 disabled:opacity-50"
                            title="Click to read the Bible text"
                            disabled={isLoading}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium flex items-center space-x-2">
                                  <span>{book.book}</span>
                                  {isLoading ? (
                                    <div className="h-3 w-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <BookOpen className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity text-blue-600" />
                                  )}
                                </div>
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
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 text-xs opacity-75">
                    ~{portion.versesCount} verses
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}        {/* All Days Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Days Overview</h2>
          <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-15">
            {plan.dailyPlan.map((day) => (
              <button
                key={day.day}
                onClick={() => setCurrentDay(day.day)}
                className={`w-10 h-10 rounded-lg text-xs font-medium transition-all ${
                  getDayCompletionStatus(day.day)
                    ? 'bg-green-500 dark:bg-green-600 text-white'
                    : currentDay === day.day
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={`Day ${day.day} - ${getDayCompletionStatus(day.day) ? 'Complete' : 'In Progress'}`}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        {/* Save Plan Button */}
        <div className="mt-6">
          <button
            onClick={handleSavePlan}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : isSaved ? (
              <Check className="h-5 w-5 mr-3" />
            ) : (
              <Save className="h-5 w-5 mr-3" />
            )}
            {isSaved ? 'Plan Saved!' : 'Save Plan'}
          </button>
        </div>
      </div>

      {/* Bible Reading Modal */}
      {selectedReading && (
        <BibleReadingModal
          isOpen={!!selectedReading}
          onClose={() => setSelectedReading(null)}
          bookName={selectedReading.bookName}
          chapters={selectedReading.chapters}
          verses={selectedReading.verses}
          sectionName={selectedReading.sectionName}
        />
      )}
    </div>
  );
}
