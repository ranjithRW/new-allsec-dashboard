import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { callHistoryRecords, reportTypes } from '../data/mockData';

// Helper function to parse duration string to seconds
const parseDurationToSeconds = (duration: string): number => {
  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes * 60 + seconds;
  }
  return 0;
};

// Helper function to format seconds back to duration string
const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to calculate dynamic KPIs
const calculateDynamicKPIs = (records: typeof callHistoryRecords) => {
  if (records.length === 0) {
    return {
      totalCalls: 0,
      avgCallDuration: '0:00',
      resolutionRate: '0%',
      escalationRate: '0%'
    };
  }

  const totalCalls = records.length;
  
  // Calculate average call duration
  const totalDurationSeconds = records.reduce((sum, record) => {
    return sum + parseDurationToSeconds(record.duration);
  }, 0);
  const avgDurationSeconds = Math.round(totalDurationSeconds / totalCalls);
  const avgCallDuration = formatDuration(avgDurationSeconds);

  // For resolution rate, we'll simulate based on call duration (longer calls = more likely resolved)
  // In a real app, this would come from actual resolution data
  const resolvedCalls = records.filter(record => {
    const durationSeconds = parseDurationToSeconds(record.duration);
    return durationSeconds > 120; // Calls longer than 2 minutes are considered resolved
  }).length;
  const resolutionRate = Math.round((resolvedCalls / totalCalls) * 100);

  // For escalation rate, we'll simulate based on call duration (shorter calls = more likely escalated)
  // In a real app, this would come from actual escalation data
  const escalatedCalls = records.filter(record => {
    const durationSeconds = parseDurationToSeconds(record.duration);
    return durationSeconds < 90; // Calls shorter than 1.5 minutes are considered escalated
  }).length;
  const escalationRate = Math.round((escalatedCalls / totalCalls) * 100);

  return {
    totalCalls,
    avgCallDuration,
    resolutionRate: `${resolutionRate}%`,
    escalationRate: `${escalationRate}%`
  };
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get stored date or default to today
const getInitialDate = () => {
  // Check if we have a stored date in localStorage (shared with CX Reports)
  const storedDate = localStorage.getItem('selectedDate');
  if (storedDate) {
    return storedDate;
  }
  // If no stored date, return today's date
  return getTodayDate();
};

export default function CallHistory() {
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  // Helper function to parse date and time from record
  const parseRecordDateTime = (dateString: string) => {
    const [date, time] = dateString.split(' ');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  };

  // Helper function to check if record is within time range
  const isWithinTimeRange = (recordDate: string, startTime: string, endTime: string) => {
    const recordDateTime = parseRecordDateTime(recordDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(recordDateTime);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(recordDateTime);
    endDateTime.setHours(endHour, endMinute, 59, 999);
    
    return recordDateTime >= startDateTime && recordDateTime <= endDateTime;
  };

  // Filter call records based on selected intent and timeline
  const filteredRecords = useMemo(() => {
    let filtered = callHistoryRecords;

    // Filter by intent
    if (selectedIntent) {
      filtered = filtered.filter(record => record.intent === selectedIntent);
    }

    // Filter by date
    const selectedDateFormatted = selectedDate; // Already in YYYY-MM-DD format
    filtered = filtered.filter(record => {
      const recordDate = record.date.split(' ')[0]; // Extract date part
      return recordDate === selectedDateFormatted;
    });

    // Filter by time range
    filtered = filtered.filter(record => 
      isWithinTimeRange(record.date, startTime, endTime)
    );

    return filtered;
  }, [selectedIntent, selectedDate, startTime, endTime]);

  // Calculate dynamic KPIs based on filtered records
  const dynamicKPIs = useMemo(() => {
    return calculateDynamicKPIs(filteredRecords);
  }, [filteredRecords]);

  // Handle page refresh/reload - reset to current date if it's a fresh page load
  useEffect(() => {
    // Check if this is a fresh page load (no stored session data)
    const isFreshPageLoad = !sessionStorage.getItem('callHistoryVisited');
    
    if (isFreshPageLoad) {
      // Mark that we've visited this page in this session
      sessionStorage.setItem('callHistoryVisited', 'true');
      
      // Reset to current date for fresh page loads
      const todayDate = getTodayDate();
      setSelectedDate(todayDate);
      localStorage.setItem('selectedDate', todayDate);
    }
  }, []);

  // Handle date change and store in localStorage
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    localStorage.setItem('selectedDate', newDate);
  };

  // Handle intent button click
  const handleIntentClick = (intent: string) => {
    if (selectedIntent === intent) {
      // If clicking the same intent, clear the filter
      setSelectedIntent(null);
    } else {
      // Set new intent filter
      setSelectedIntent(intent);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Call History and Transcripts</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">View and analyze all customer interactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIntent(null)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border transition-all ${
              !selectedIntent 
                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }`}
          >
            All
          </motion.button>
          {reportTypes.map((report, index) => {
            const isActive = selectedIntent === report.label;
            return (
              <motion.button
                key={report.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleIntentClick(report.label)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border transition-all ${
                  isActive 
                    ? report.color 
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {report.label}
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Timeline:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {[
          { label: 'Total Calls', value: dynamicKPIs.totalCalls, color: 'from-blue-500 to-cyan-500' },
          { label: 'Avg Call Duration', value: dynamicKPIs.avgCallDuration, color: 'from-green-500 to-emerald-500' },
          { label: 'Resolution Rate', value: dynamicKPIs.resolutionRate, color: 'from-purple-500 to-pink-500' },
          { label: 'Escalation Rate', value: dynamicKPIs.escalationRate, color: 'from-amber-500 to-orange-500' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{kpi.label}</p>
            <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${kpi.color} gradient-text`}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Call Records</h3>
            <div className="flex flex-col items-end">
              {/* <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredRecords.length} of {callHistoryRecords.length} records
              </span> */}
              {(selectedIntent || selectedDate !== getTodayDate() || startTime !== '00:00' || endTime !== '23:59') && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedIntent && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Intent: {selectedIntent}
                    </span>
                  )}
                  {selectedDate !== getTodayDate() && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Date: {selectedDate}
                    </span>
                  )}
                  {(startTime !== '00:00' || endTime !== '23:59') && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      Time: {startTime} - {endTime}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Caller</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Agent</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Intent</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Audio</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  whileHover={{ backgroundColor: 'var(--tw-bg-opacity, 1) rgb(249 250 251 / var(--tw-bg-opacity))' }}
                  className="transition-colors"
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{record.caller}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{record.date}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">{record.agent}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">{record.duration}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                      record.intent === 'Fraud Reporting' ? 'bg-blue-100 text-blue-700' :
                      record.intent === 'Change Disputes' ? 'bg-green-100 text-green-700' :
                      record.intent === 'Due Date Changes' ? 'bg-purple-100 text-purple-700' :
                      record.intent === 'Credit Report Disputes' ? 'bg-amber-100 text-amber-700' :
                      record.intent === 'Auto-pay Enrollment' ? 'bg-cyan-100 text-cyan-700' :
                      record.intent === 'Balance Enquiry' ? 'bg-pink-100 text-pink-700' :
                      record.intent === 'Customer Trade Lines' ? 'bg-indigo-100 text-indigo-700' :
                      record.intent === 'T&C requests' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {record.intent}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      Play
                    </button>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{record.transcript}</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
