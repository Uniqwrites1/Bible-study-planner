'use client';

import { useState, useEffect } from 'react';
import { StudyPlan } from '@/types/bible';
import { loadSavedPlans, deleteSavedPlan } from '@/utils/exportUtils';
import { Calendar, Trash2, Download, Clock, TrendingUp } from 'lucide-react';

interface SavedPlansManagerProps {
  onLoadPlan: (plan: StudyPlan, progress: { [day: number]: boolean }) => void;
  onClose: () => void;
}

export default function SavedPlansManager({ onLoadPlan, onClose }: SavedPlansManagerProps) {
  const [savedPlans, setSavedPlans] = useState<Array<{ 
    key: string; 
    plan: StudyPlan; 
    progress: { [day: number]: boolean }; 
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
  };

  const getProgressInfo = (progress: { [day: number]: boolean }, totalDays: number) => {
    const completedDays = Object.values(progress).filter(Boolean).length;
    const percentage = Math.round((completedDays / totalDays) * 100);
    return { completedDays, percentage };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Saved Bible Study Plans</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Plans</h3>
              <p className="text-gray-500">You haven&apos;t saved any Bible study plans yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedPlans.map((savedPlan) => {
                const { completedDays, percentage } = getProgressInfo(savedPlan.progress, savedPlan.plan.duration);
                
                return (
                  <div
                    key={savedPlan.key}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {savedPlan.plan.duration}-Day Plan
                        </h3>
                        <p className="text-sm text-gray-500">
                          Saved on {new Date(savedPlan.savedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePlan(savedPlan.key)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {completedDays} of {savedPlan.plan.duration} days completed
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
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
                        onLoadPlan(savedPlan.plan, savedPlan.progress);
                        onClose();
                      }}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
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
