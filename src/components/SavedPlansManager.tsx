'use client';

import { useState, useEffect } from 'react';
import { StudyPlan, DayProgress } from '@/types/bible';
import { loadSavedPlans, deleteSavedPlan } from '@/utils/exportUtils';
import { Calendar, Trash2, Download, Clock, TrendingUp } from 'lucide-react';

interface SavedPlansManagerProps {
  onLoadPlan: (plan: StudyPlan, progress: DayProgress) => void;
  onClose: () => void;
}

export default function SavedPlansManager({ onLoadPlan, onClose }: SavedPlansManagerProps) {  const [savedPlans, setSavedPlans] = useState<Array<{ 
    key: string; 
    plan: StudyPlan; 
    progress?: { [day: number]: boolean }; 
    sectionProgress?: DayProgress; 
    savedDate: string 
  }>>([]);

  useEffect(() => {
    setSavedPlans(loadSavedPlans());
  }, []);

  const handleDeletePlan = (key: string) => {
    if (confirm('Are you sure you want to delete this saved plan?')) {
      deleteSavedPlan(key);
      setSavedPlans(loadSavedPlans());
    }
  };  const getProgressInfo = (savedPlan: { 
    plan: StudyPlan; 
    progress?: { [day: number]: boolean }; 
    sectionProgress?: DayProgress; 
  }, totalDays: number) => {
    // Handle both old format (progress) and new format (sectionProgress)
    if (savedPlan.sectionProgress) {
      // New section-based progress
      let completedSections = 0;
      let totalSections = 0;
      
      savedPlan.plan.dailyPlan.forEach((dailyReading) => {
        const sectionNames = Object.keys(dailyReading.sections);
        totalSections += sectionNames.length;
        
        const dayProgress = savedPlan.sectionProgress![dailyReading.day];
        if (dayProgress) {
          sectionNames.forEach((sectionName: string) => {
            if (dayProgress[sectionName]) {
              completedSections++;
            }
          });
        }
      });
      
      const percentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
      return { completedDays: Math.floor(completedSections / 6), percentage, completedSections, totalSections };
    } else if (savedPlan.progress) {
      // Old day-based progress
      const completedDays = Object.values(savedPlan.progress).filter(Boolean).length;
      const percentage = Math.round((completedDays / totalDays) * 100);
      return { completedDays, percentage };
    }
    
    return { completedDays: 0, percentage: 0 };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden border dark:border-gray-700 transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Bible Study Plans</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Saved Plans</h3>
              <p className="text-gray-500 dark:text-gray-400">You haven&apos;t saved any Bible study plans yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedPlans.map((savedPlan) => {
                const progressInfo = getProgressInfo(savedPlan, savedPlan.plan.duration);
                
                return (
                  <div
                    key={savedPlan.key}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {savedPlan.plan.duration}-Day Plan
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Saved on {new Date(savedPlan.savedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePlan(savedPlan.key)}
                        className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{progressInfo.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressInfo.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {savedPlan.sectionProgress 
                          ? `${progressInfo.completedSections || 0} of ${progressInfo.totalSections || 0} sections completed`
                          : `${progressInfo.completedDays} of ${savedPlan.plan.duration} days completed`
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{savedPlan.plan.duration} days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{savedPlan.plan.dailyPlan.length} readings</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Handle both old and new progress formats
                        const progressToLoad = savedPlan.sectionProgress || {};
                        onLoadPlan(savedPlan.plan, progressToLoad);
                        onClose();
                      }}
                      className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Load Plan</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
