# Bible Study Plan App

A beautiful, responsive web application built with React and Next.js that helps you create personalized Bible reading plans and track your progress through the entire Bible.

## 🌟 Features

### Core Functionality
- **Flexible Duration**: Create study plans from 30 to 365 days
- **Balanced Reading**: Daily portions from all 6 Bible sections:
  - History (Genesis - Job)
  - Psalms
  - Wisdom Literature (Proverbs - Song of Songs)
  - Prophets (Isaiah - Malachi)
  - New Testament (Matthew - Jude)
  - Revelation

### Progress Tracking
- ✅ Daily completion checkboxes
- 📊 Visual progress bar
- 💾 Automatic progress saving with localStorage
- 📅 Day navigation with visual overview

### Data Management
- 💾 Save and load multiple study plans
- 📤 Export functionality:
  - PDF/Print for physical copies
  - JSON for data backup
  - CSV for spreadsheet analysis
- 🔗 Share plans with others

### User Experience
- 🎨 Beautiful, modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🎯 Intuitive navigation and controls
- 🌈 Color-coded sections for easy identification

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.3 with React 18
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for beautiful icons
- **Storage**: Browser localStorage for persistence

## 📖 Bible Data

The app includes comprehensive Bible data with:
- **66 Books** of the Bible
- **31,102 Total Verses** accurately counted
- Proportional verse distribution algorithm for balanced daily readings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bible-study-plan.git
cd bible-study-plan
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 How to Use

1. **Create a Plan**: Choose your desired duration (30-365 days)
2. **Daily Reading**: View your daily reading assignments organized by section
3. **Track Progress**: Check off completed days and watch your progress grow
4. **Navigate**: Jump to any day or use previous/next buttons
5. **Save Plans**: Save multiple plans with different durations
6. **Export**: Download your plan as PDF, JSON, or CSV

## 🎯 Algorithm Details

The app uses a sophisticated algorithm to distribute Bible verses proportionally:

- **History Section**: ~60% of total verses (18,797 verses)
- **Psalms**: ~8% of total verses (2,461 verses)
- **Wisdom**: ~3% of total verses (906 verses)
- **Prophets**: ~18% of total verses (5,616 verses)
- **New Testament**: ~10% of total verses (3,116 verses)
- **Revelation**: ~1% of total verses (404 verses)

This ensures balanced daily readings while maintaining the integrity of books and chapters.

## 📂 Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── PlanSetup.tsx           # Duration selection
│   ├── StudyPlanView.tsx       # Main reading interface  
│   └── SavedPlansManager.tsx   # Plan management
├── data/                # Bible data
├── types/               # TypeScript definitions
└── utils/               # Utility functions
    ├── studyPlanGenerator.ts   # Plan generation logic
    └── exportUtils.ts          # Export functionality
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Bible verse counts sourced from public domain references
- Built with modern web technologies for optimal user experience
- Designed with accessibility and usability in mind

---

**Start your Bible reading journey today!** 📖✨
