import { StudyPlan } from '@/types/bible';

export function exportToPDF(plan: StudyPlan, progress: { [day: number]: boolean }) {
  // Note: For a production app, you'd want to use a library like jsPDF or react-pdf
  // For now, we'll create a printable version
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const completedDays = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Math.round((completedDays / plan.duration) * 100);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${plan.duration}-Day Bible Study Plan</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
        .progress { background: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        .day { margin-bottom: 25px; page-break-inside: avoid; }
        .day-header { background: #4f46e5; color: white; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .section { margin: 10px 0; padding: 10px; border-left: 4px solid #4f46e5; background: #f8fafc; }
        .book { margin: 5px 0; font-weight: bold; }
        .verses { margin-left: 20px; color: #666; }
        .completed { background: #dcfce7; border-left-color: #16a34a; }
        @media print { 
          body { margin: 0; } 
          .day { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${plan.duration}-Day Bible Study Plan</h1>
        <p>Progress: ${completedDays} of ${plan.duration} days completed (${progressPercentage}%)</p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="progress">
        <h3>Plan Overview</h3>
        <p>This plan will take you through the entire Bible in ${plan.duration} days with balanced daily readings from:</p>
        <ul>
          <li>History books (Genesis to Job)</li>
          <li>Psalms</li>
          <li>Wisdom literature (Proverbs to Song of Songs)</li>
          <li>Prophets (Isaiah to Malachi)</li>
          <li>New Testament (Matthew to Jude)</li>
          <li>Revelation</li>
        </ul>
      </div>

      ${plan.dailyPlan.map(day => `
        <div class="day">
          <div class="day-header">
            <h3>Day ${day.day} ${progress[day.day] ? '✓ Completed' : ''}</h3>
          </div>
          ${Object.entries(day.sections).map(([sectionName, portion]) => `
            <div class="section ${progress[day.day] ? 'completed' : ''}">
              <h4>${sectionName}</h4>
              ${portion.books.map(book => `
                <div class="book">${book.book}</div>
                ${book.chapters ? `<div class="verses">Chapters: ${book.chapters.join(', ')}</div>` : ''}
                ${book.verses ? `<div class="verses">Verses: ${book.verses}</div>` : ''}
              `).join('')}
              <div class="verses">~${portion.versesCount} verses</div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
}

export function exportToJSON(plan: StudyPlan, progress: { [day: number]: boolean }) {
  const exportData = {
    plan,
    progress,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `bible-study-plan-${plan.duration}days-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(plan: StudyPlan, progress: { [day: number]: boolean }) {
  const headers = ['Day', 'Completed', 'Section', 'Books', 'Verses Count'];
  const rows = [headers.join(',')];

  plan.dailyPlan.forEach(day => {
    Object.entries(day.sections).forEach(([sectionName, portion]) => {
      const booksStr = portion.books.map(book => {
        let bookInfo = book.book;
        if (book.chapters) bookInfo += ` (Ch: ${book.chapters.join(', ')})`;
        if (book.verses) bookInfo += ` (V: ${book.verses})`;
        return bookInfo;
      }).join('; ');

      rows.push([
        day.day,
        progress[day.day] ? 'Yes' : 'No',
        sectionName,
        `"${booksStr}"`,
        portion.versesCount
      ].join(','));
    });
  });

  const csvContent = rows.join('\n');
  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `bible-study-plan-${plan.duration}days-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function sharePlan(plan: StudyPlan) {
  const shareText = `Check out my ${plan.duration}-day Bible study plan! It includes daily readings from all sections of the Bible for a complete journey through Scripture.`;
  const shareUrl = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: `${plan.duration}-Day Bible Study Plan`,
      text: shareText,
      url: shareUrl
    }).catch(console.error);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
      alert('Plan details copied to clipboard!');
    }).catch(() => {
      alert('Unable to share. Please copy the URL manually.');
    });
  }
}

export function savePlanLocally(plan: StudyPlan, progress: { [day: number]: boolean }) {
  const planData = {
    plan,
    progress,
    savedDate: new Date().toISOString()
  };
  
  localStorage.setItem(`bible-plan-${plan.duration}-${Date.now()}`, JSON.stringify(planData));
  return true;
}

export function loadSavedPlans(): Array<{ key: string; plan: StudyPlan; progress: { [day: number]: boolean }; savedDate: string }> {
  const savedPlans = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('bible-plan-')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        savedPlans.push({ key, ...data });
      } catch (error) {
        console.error('Error loading saved plan:', error);
      }
    }
  }
  
  return savedPlans.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
}

export function deleteSavedPlan(key: string) {
  localStorage.removeItem(key);
}
