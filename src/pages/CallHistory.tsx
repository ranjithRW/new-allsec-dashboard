import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { callHistoryKPI, callHistoryRecords, reportTypes } from '../data/mockData';

export default function CallHistory() {
  const [selectedDate, setSelectedDate] = useState('2025-10-23');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

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
          {reportTypes.map((report, index) => (
            <motion.button
              key={report.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border ${report.color} transition-all`}
            >
              {report.label}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Timeline:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
          { label: 'Total Calls', value: callHistoryKPI.totalCalls, color: 'from-blue-500 to-cyan-500' },
          { label: 'Avg Call Duration', value: callHistoryKPI.avgCallDuration, color: 'from-green-500 to-emerald-500' },
          { label: 'Resolution Rate', value: callHistoryKPI.resolutionRate, color: 'from-purple-500 to-pink-500' },
          { label: 'Escalation Rate', value: callHistoryKPI.escalationRate, color: 'from-amber-500 to-orange-500' }
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Call Records</h3>
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
              {callHistoryRecords.map((record, index) => (
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
                    <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
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
