'use client';

import { useState, useEffect } from 'react';
import PlanSetup from '@/components/PlanSetup';
import StudyPlanView from '@/components/StudyPlanView';
import SavedPlansManager from '@/components/SavedPlansManager';
import ThemeToggle from '@/components/ThemeToggle';
import { generateStudyPlan } from '@/utils/studyPlanGenerator';
import { StudyPlan, DayProgress } from '@/types/bible';

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [currentProgress, setCurrentProgress] = useState<DayProgress>({});
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreatePlan = (duration: number) => {
    const plan = generateStudyPlan(duration);
    setCurrentPlan(plan);
    setCurrentProgress({});
  };

  const handleLoadPlan = (plan: StudyPlan, progress: DayProgress) => {
    setCurrentPlan(plan);
    setCurrentProgress(progress);
  };

  const handleBackToSetup = () => {
    setCurrentPlan(null);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {!currentPlan ? (
          <PlanSetup 
            onCreatePlan={handleCreatePlan} 
            onShowSavedPlans={() => setShowSavedPlans(true)}
          />
        ) : (
          <StudyPlanView 
            plan={currentPlan} 
            onBack={handleBackToSetup}
            initialProgress={currentProgress}
          />
        )}
        
        {showSavedPlans && (
          <SavedPlansManager
            onLoadPlan={handleLoadPlan}
            onClose={() => setShowSavedPlans(false)}
          />
        )}
      </div>
      
      {/* Copyright Footer */}
      <footer className="bg-black dark:bg-gray-950 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-yellow-400 font-bold text-lg">Uniqwrites</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-300">Bible Study Planner</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Uniqwrites. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Empowering your spiritual journey through structured Bible reading
          </p>
        </div>
      </footer>
    </main>
  );
}
