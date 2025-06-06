import React, { use, useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { useSubmissionStore } from '../store/useSubmissionStore';

function ContributionGraph() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { submissionCounts, getSubmissionCountsByDate } = useSubmissionStore();

  useEffect(() => {
    getSubmissionCountsByDate();
  }, [])


  const aggregated = Object.values(
    submissionCounts.reduce((acc, curr) => {
      const dateStr = (typeof curr.date === "string")
        ? curr.date.slice(0, 10)
        : curr.date.toISOString().slice(0, 10);
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, count: 0 };
      }
      acc[dateStr].count += curr.count;
      return acc;
    }, {})
  );



  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{ padding: 20 }}>
      {/* <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ marginBottom: 20 }}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button> */}
      <CalendarHeatmap
        startDate={new Date('2024-06-08')}
        endDate={new Date('2025-06-08')}
        values={aggregated}
        classForValue={value => {
          if (!value) return 'color-empty';
          if (value.count >= 4) return 'color-scale-4';
          if (value.count >= 3) return 'color-scale-3';
          if (value.count >= 2) return 'color-scale-2';
          if (value.count >= 1) return 'color-scale-1';
          return 'color-empty';
        }}
        showMonthLabels={true}
      />
    </div>
  );
}

export default ContributionGraph;
