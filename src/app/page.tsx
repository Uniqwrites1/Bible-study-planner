'use client';

import { useState, useEffect } from 'react';
import PlanSetup from '@/components/PlanSetup';
import StudyPlanView from '@/components/StudyPlanView';
import SavedPlansManager from '@/components/SavedPlansManager';
import { generateStudyPlan } from '@/utils/studyPlanGenerator';
import { StudyPlan } from '@/types/bible';

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [currentProgress, setCurrentProgress] = useState<{ [day: number]: boolean }>({});
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

  const handleLoadPlan = (plan: StudyPlan, progress: { [day: number]: boolean }) => {
    setCurrentPlan(plan);
    setCurrentProgress(progress);
  };

  const handleBackToSetup = () => {
    setCurrentPlan(null);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
    </main>
  );
}
