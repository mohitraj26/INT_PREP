import React, { useEffect } from 'react';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { useSubmissionStore } from '../store/useSubmissionStore';
import { useThemeContext } from '../context/Theme';

const CalendarHeatmap = ({ startDate, endDate, values, classForValue, showMonthLabels }) => {
  const getDaysInYear = () => {
    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().slice(0, 10);
      const value = values.find(v => v.date === dateStr);
      days.push({
        date: dateStr,
        count: value ? value.count : 0,
        className: classForValue(value),
        dayOfWeek: current.getDay(),
        month: current.getMonth()
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInYear();
  const weeks = [];
  let currentWeek = [];

  days.forEach((day, index) => {
    if (index === 0) {
      for (let i = 0; i < day.dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getMonthPositions = () => {
    const positions = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week.find(day => day !== null);
      if (firstDay && firstDay.month !== currentMonth) {
        currentMonth = firstDay.month;
        positions.push({
          month: months[currentMonth],
          position: weekIndex
        });
      }
    });

    return positions;
  };

  const monthPositions = getMonthPositions();

  return (
    <div className="calendar-heatmap w-full">
      {showMonthLabels && (
        <div className="relative mb-4">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {monthPositions.map((monthData, index) => (
              <div
                key={`${monthData.month}-${index}`}
                className="text-xs sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium"
                style={{ gridColumnStart: monthData.position + 1 }}
              >
                {monthData.month}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day labels and grid */}
      <div className="flex mb-2">
        <div className="w-5 sm:w-5 md:w-14 flex flex-col gap-1 text-xs sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mr-2">
          <div className="h-3"></div>
          <div>Mon</div>
          <div className="h-3"></div>
          <div>Wed</div>
          <div className="h-3"></div>
          <div>Fri</div>
          <div className="h-3"></div>
        </div>

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={day ? day.date : `empty-${weekIndex}-${dayIndex}`}
                  className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-sm transition-all duration-200 hover:scale-110 cursor-pointer ${
                    day ? day.className : 'bg-transparent'
                  }`}
                  title={day ? `${day.date}: ${day.count} contributions` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function ContributionGraph() {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { submissionCounts, getSubmissionCountsByDate } = useSubmissionStore();

  useEffect(() => {
    getSubmissionCountsByDate();
  }, []);

  const aggregated = Object.values(
    submissionCounts.reduce((acc, curr) => {
      const dateStr = typeof curr.date === 'string'
        ? curr.date.slice(0, 10)
        : curr.date.toISOString().slice(0, 10);
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, count: 0 };
      }
      acc[dateStr].count += curr.count;
      return acc;
    }, {})
  );

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const totalContributions = aggregated.reduce((sum, item) => sum + item.count, 0);
  const activeDays = aggregated.filter(item => item.count > 0).length;
  const currentStreak = 0;

  return (
    <div className={`w-full transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-blue-500/25'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-purple-500/25'
            }`}>
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Contribution Graph
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track your daily progress and build consistency
              </p>
            </div>
          </div>
        </div>

                 {/* Stats Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className={`group p-4 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/30'
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/30'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'
                }`}>
                  {totalContributions}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Contributions
                </p>
              </div>
            </div>
            <div className={`mt-4 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
          <div className={`group p-4 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30'
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {activeDays}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Days
                </p>
              </div>
            </div>
            <div className={`mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
          <div className={`group p-4 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30'
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white group-hover:text-orange-400' : 'text-gray-900 group-hover:text-orange-600'
                }`}>
                  {currentStreak}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current Streak
                </p>
              </div>
            </div>
            <div className={`mt-4 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className={`p-2 sm:p-4 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 shadow-2xl shadow-gray-900/30'
            : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200/50 shadow-2xl shadow-gray-200/30'
        }`}>
          <div className="mb-8">
            <h2 className={`text-lg sm:text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Past Year Activity
            </h2>
            <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Each square represents a day. Darker colors indicate more activity.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={aggregated}
                classForValue={value => {
                  if (!value) return `color-empty ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-600/40' : 'bg-gray-200 hover:bg-gray-300'}`;

                  if (value.count >= 4) return `bg-green-600 hover:bg-green-700 shadow-sm shadow-green-600/50`;
                  if (value.count >= 3) return `bg-green-500 hover:bg-green-600 shadow-sm shadow-green-500/50`;
                  if (value.count >= 2) return `bg-green-400 hover:bg-green-500 shadow-sm shadow-green-400/50`;
                  if (value.count >= 1) return `bg-green-300 hover:bg-green-400 shadow-sm shadow-green-300/50`;
                  return `bg-gray-200 hover:bg-gray-300`;
                }}
                showMonthLabels={true}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-2">
            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Less
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-green-800' : 'bg-green-300'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-green-600' : 'bg-green-400'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-green-500' : 'bg-green-500'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-green-400' : 'bg-green-600'}`}></div>
            </div>
            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              More
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .calendar-heatmap {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default ContributionGraph;
