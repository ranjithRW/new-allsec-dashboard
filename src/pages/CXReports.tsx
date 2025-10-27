import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
import { getIntentAccuracyDataForDate, getSentimentDataForDate, getKPIsForDate } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CXReports() {
  // State for date filtering
  const [selectedDate, setSelectedDate] = useState('2025-10-23'); // Default to today
  
  // Get filtered data for selected date
  const filteredKPIs = getKPIsForDate(selectedDate);
  const filteredIntentData = getIntentAccuracyDataForDate(selectedDate);
  const filteredSentimentData = getSentimentDataForDate(selectedDate);
  
  // Create chart data for sentiment analysis using filtered data
  const sentimentChartData = {
    labels: filteredSentimentData.labels,
    datasets: [
      {
        label: 'Customer Sentiment',
        data: filteredSentimentData.values,
        backgroundColor: filteredSentimentData.colors,
        borderColor: filteredSentimentData.borderColors,
        borderWidth: 1
      }
    ]
  };

  const sentimentChartOptions = {
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
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('dashboard-root');
    if (!element) {
      alert('Dashboard element not found.');
      return;
    }

    // Temporarily change gradient text to solid colors for better PDF rendering
    const gradientElements = element.querySelectorAll('.gradient-text');
    const originalStyles: { element: HTMLElement; color: string; background: string; webkitTextFillColor: string }[] = [];
    
    gradientElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      originalStyles.push({
        element: htmlEl,
        color: htmlEl.style.color,
        background: htmlEl.style.background,
        webkitTextFillColor: htmlEl.style.webkitTextFillColor
      });
      
      // Set solid color for PDF export
      htmlEl.style.color = '#1f2937';
      htmlEl.style.background = 'none';
      htmlEl.style.webkitTextFillColor = 'initial';
    });

    // Hide the export button during PDF generation
    const exportButton = element.querySelector('.export-pdf-button') as HTMLElement;
    let originalButtonDisplay = '';
    if (exportButton) {
      originalButtonDisplay = exportButton.style.display;
      exportButton.style.display = 'none';
    }

    // Use html2canvas to capture the element and jsPDF to create the PDF
    html2canvas(element, { 
      scale: 1.5, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Determine page orientation based on content dimensions
        const tempPdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = tempPdf.getImageProperties(imgData);
        const isLandscape = imgProps.width > imgProps.height;
        const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Ensure content fits within page width
        const maxWidth = pdfWidth - 20; // 10mm margin on each side
        const maxHeight = pdf.internal.pageSize.getHeight() - 20; // 10mm margin top/bottom
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        if (pdfHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = (imgProps.width * finalHeight) / imgProps.height;
        }
        
        if (finalWidth > maxWidth) {
          finalWidth = maxWidth;
          finalHeight = (imgProps.height * finalWidth) / imgProps.width;
        }

        // Center the content on the page
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdf.internal.pageSize.getHeight() - finalHeight) / 2;

        // If content is larger than page, split into multiple pages
        let position = yOffset;
        pdf.addImage(imgData, 'PNG', xOffset, position, finalWidth, finalHeight);

        // Add extra pages if needed
        if (finalHeight > pdf.internal.pageSize.getHeight() - 20) {
          let remainingHeight = finalHeight - (pdf.internal.pageSize.getHeight() - 20);
          while (remainingHeight > 0) {
            pdf.addPage();
            position = -pdf.internal.pageSize.getHeight() * (Math.ceil((finalHeight - remainingHeight) / pdf.internal.pageSize.getHeight()));
            pdf.addImage(imgData, 'PNG', xOffset, position, finalWidth, finalHeight);
            remainingHeight -= pdf.internal.pageSize.getHeight();
          }
        }

        pdf.save('dashboard.pdf');
        
        // Restore original gradient styles
        originalStyles.forEach(({ element, color, background, webkitTextFillColor }) => {
          element.style.color = color;
          element.style.background = background;
          element.style.webkitTextFillColor = webkitTextFillColor;
        });

        // Restore export button visibility
        if (exportButton) {
          exportButton.style.display = originalButtonDisplay;
        }
      })
      .catch((err) => {
        // Restore original gradient styles even on error
        originalStyles.forEach(({ element, color, background, webkitTextFillColor }) => {
          element.style.color = color;
          element.style.background = background;
          element.style.webkitTextFillColor = webkitTextFillColor;
        });

        // Restore export button visibility even on error
        if (exportButton) {
          exportButton.style.display = originalButtonDisplay;
        }
        
        // Fallback alert
        // eslint-disable-next-line no-console
        console.error('Failed to export PDF', err);
        alert('Failed to export PDF. See console for details.');
      });
  };

  const intentChartData = {
    labels: filteredIntentData.labels,
    datasets: [
      {
        label: 'Calls escalated',
        data: filteredIntentData.escalated,
        backgroundColor: 'rgba(209, 213, 219, 0.8)',
        borderColor: 'rgba(209, 213, 219, 1)',
        borderWidth: 1
      },
      {
        label: 'vs handled by AI',
        data: filteredIntentData.aiHandled,
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
  <div id="dashboard-root" className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-start justify-between mb-6 gap-4"
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Voice Agent Performance Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Comprehensive analytics and insights</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="export-pdf-button flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-xs sm:text-base whitespace-nowrap"
          >
            <Download size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export as PDF</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Intent Recognition', value: filteredKPIs.intentRecognition, color: 'from-blue-500 to-cyan-500' },
          { label: 'Average Response Time', value: filteredKPIs.avgResponseTime, color: 'from-green-500 to-emerald-500' },
          { label: 'Cost', value: filteredKPIs.cost, color: 'from-amber-500 to-orange-500' },
          { label: `Total Calls (${selectedDate})`, value: filteredKPIs.totalCallsToday, color: 'from-purple-500 to-pink-500' },
          { label: 'Average Resolution Time', value: filteredKPIs.avgResolutionTime, color: 'from-cyan-500 to-blue-500' },
          { label: 'Unassigned Tickets', value: filteredKPIs.unassignedTickets, color: 'from-red-500 to-orange-500' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{kpi.label}</p>
            <p className={`text-sm sm:text-xl font-bold text-black dark:text-white`}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Intent Accuracy</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Calls escalated vs handled by ALLsec AI for {selectedDate}</p>
          <div className="h-64 sm:h-80">
            <Bar data={intentChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Analysis
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
            Customer sentiment distribution for {selectedDate}
          </p>
          <div className="h-64 sm:h-80">
            <Bar data={sentimentChartData} options={sentimentChartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
