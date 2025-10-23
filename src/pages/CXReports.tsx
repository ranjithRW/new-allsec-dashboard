import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { cxReportsKPI, intentAccuracyData, ticketStatusByWeek } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CXReports() {
  const handleExportPDF = () => {
    alert('Exporting dashboard as PDF...');
  };

  const intentChartData = {
    labels: intentAccuracyData.labels,
    datasets: [
      {
        label: 'Calls escalated',
        data: intentAccuracyData.escalated,
        backgroundColor: 'rgba(209, 213, 219, 0.8)',
        borderColor: 'rgba(209, 213, 219, 1)',
        borderWidth: 1
      },
      {
        label: 'vs handled by AI',
        data: intentAccuracyData.aiHandled,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 },
          padding: 15
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Agent Performance Dashboard</h2>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
        >
          <Download size={20} />
          Export as PDF
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Intent Recognition', value: cxReportsKPI.intentRecognition, color: 'from-blue-500 to-cyan-500' },
          { label: 'Average Response Time', value: cxReportsKPI.avgResponseTime, color: 'from-green-500 to-emerald-500' },
          { label: 'CSAT Score', value: cxReportsKPI.csatScore, color: 'from-amber-500 to-orange-500' },
          { label: 'Sentiment Analysis', value: cxReportsKPI.sentimentAnalysis, color: 'from-purple-500 to-pink-500' },
          { label: 'Average Resolution Time', value: cxReportsKPI.avgResolutionTime, color: 'from-cyan-500 to-blue-500' },
          { label: 'Unassigned Tickets', value: cxReportsKPI.unassignedTickets, color: 'from-red-500 to-orange-500' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <p className="text-sm text-gray-600 font-medium mb-2">{kpi.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Intent Accuracy</h3>
          <p className="text-sm text-gray-600 mb-6">Calls escalated vs handled by AI</p>
          <div className="h-80">
            <Bar data={intentChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status by Week</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Week 1</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {ticketStatusByWeek.week1.open}
                    </div>
                    <div className="text-xs text-blue-700 font-medium">Open</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {ticketStatusByWeek.week1.resolved}
                    </div>
                    <div className="text-xs text-green-700 font-medium">Resolved</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Week 2</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {ticketStatusByWeek.week2.open}
                    </div>
                    <div className="text-xs text-blue-700 font-medium">Open</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {ticketStatusByWeek.week2.resolved}
                    </div>
                    <div className="text-xs text-green-700 font-medium">Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
