'use client'

import { motion } from 'framer-motion'
import { Download, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getKPIsForPeriod, getSentimentDataForPeriod, getIntentCountDataForPeriod } from '../../data/mockData'
import PieChart from '../charts/PieChart'
import BarChart from '../charts/BarChart'

export default function CXReports() {
  // State for date filtering - initialize with default values to avoid hydration mismatch
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Format: YYYY-MM-DD
  })

  // State for period filtering - initialize with default value to avoid hydration mismatch
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day')

  // Load saved values from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('selectedDate')
      const savedPeriod = localStorage.getItem('selectedPeriod') as 'day' | 'week' | 'month'
      
      if (savedDate) {
        setSelectedDate(savedDate)
      }
      if (savedPeriod) {
        setSelectedPeriod(savedPeriod)
      }
    }
  }, [])

  // Update localStorage whenever selectedDate changes
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDate', newDate)
    }
  }

  // Handle period change
  const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month') => {
    setSelectedPeriod(newPeriod)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPeriod', newPeriod)
    }
    
    // Convert current date to appropriate format for new period
    const currentDate = new Date(selectedDate)
    let newDate = selectedDate
    
    if (newPeriod === 'month') {
      // Convert to YYYY-MM format
      newDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    } else if (newPeriod === 'week') {
      // Keep the same date for week (will be used to find the week)
      newDate = selectedDate
    } else {
      // Keep the same date for day
      newDate = selectedDate
    }
    
    setSelectedDate(newDate)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDate', newDate)
    }
  }

  // Get the appropriate input type and value based on period
  const getDateInputProps = () => {
    switch (selectedPeriod) {
      case 'month':
        return {
          type: 'month' as const,
          value: selectedDate.includes('-') && selectedDate.split('-').length === 2 ? selectedDate : `${new Date(selectedDate).getFullYear()}-${String(new Date(selectedDate).getMonth() + 1).padStart(2, '0')}`,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const monthValue = e.target.value
            // Convert YYYY-MM to YYYY-MM-01 for processing
            const fullDate = `${monthValue}-01`
            handleDateChange(fullDate)
          }
        }
      case 'week':
        return {
          type: 'week' as const,
          value: (() => {
            const date = new Date(selectedDate)
            const year = date.getFullYear()
            const week = getWeekNumber(date)
            return `${year}-W${String(week).padStart(2, '0')}`
          })(),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const weekValue = e.target.value
            // Convert YYYY-WXX to a date within that week
            const [year, weekStr] = weekValue.split('-W')
            const week = parseInt(weekStr)
            const date = getDateFromWeek(parseInt(year), week)
            handleDateChange(date.toISOString().split('T')[0])
          }
        }
      case 'day':
      default:
        return {
          type: 'date' as const,
          value: selectedDate,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e.target.value)
        }
    }
  }

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Helper function to get date from week number
  const getDateFromWeek = (year: number, week: number) => {
    const firstDayOfYear = new Date(year, 0, 1)
    const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay()
    return new Date(firstDayOfYear.getTime() + daysToAdd * 86400000)
  }
  
  // Get filtered data for selected date and period
  const filteredKPIs = getKPIsForPeriod(selectedDate, selectedPeriod)
  const filteredSentimentData = getSentimentDataForPeriod(selectedDate, selectedPeriod)
  const filteredIntentCountData = getIntentCountDataForPeriod(selectedDate, selectedPeriod)
  

  const handleExportPDF = () => {
    const element = document.getElementById('dashboard-root')
    if (!element) {
      alert('Dashboard element not found.')
      return
    }

    // Temporarily change gradient text to solid colors for better PDF rendering
    const gradientElements = element.querySelectorAll('.gradient-text')
    const originalStyles: { element: HTMLElement; color: string; background: string; webkitTextFillColor: string }[] = []
    
    gradientElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      originalStyles.push({
        element: htmlEl,
        color: htmlEl.style.color,
        background: htmlEl.style.background,
        webkitTextFillColor: htmlEl.style.webkitTextFillColor
      })
      
      // Set solid color for PDF export
      htmlEl.style.color = '#1f2937'
      htmlEl.style.background = 'none'
      htmlEl.style.webkitTextFillColor = 'initial'
    })

    // Hide the export button during PDF generation
    const exportButton = element.querySelector('.export-pdf-button') as HTMLElement
    let originalButtonDisplay = ''
    if (exportButton) {
      originalButtonDisplay = exportButton.style.display
      exportButton.style.display = 'none'
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
        const imgData = canvas.toDataURL('image/png')
        
        // Determine page orientation based on content dimensions
        const tempPdf = new jsPDF('p', 'mm', 'a4')
        const imgProps = tempPdf.getImageProperties(imgData)
        const isLandscape = imgProps.width > imgProps.height
        const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a4')

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        // Ensure content fits within page width
        const maxWidth = pdfWidth - 20 // 10mm margin on each side
        const maxHeight = pdf.internal.pageSize.getHeight() - 20 // 10mm margin top/bottom
        
        let finalWidth = pdfWidth
        let finalHeight = pdfHeight
        
        if (pdfHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = (imgProps.width * finalHeight) / imgProps.height
        }
        
        if (finalWidth > maxWidth) {
          finalWidth = maxWidth
          finalHeight = (imgProps.height * finalWidth) / imgProps.width
        }

        // Center the content on the page
        const xOffset = (pdfWidth - finalWidth) / 2
        const yOffset = (pdf.internal.pageSize.getHeight() - finalHeight) / 2

        // If content is larger than page, split into multiple pages
        let position = yOffset
        pdf.addImage(imgData, 'PNG', xOffset, position, finalWidth, finalHeight)

        // Add extra pages if needed
        if (finalHeight > pdf.internal.pageSize.getHeight() - 20) {
          let remainingHeight = finalHeight - (pdf.internal.pageSize.getHeight() - 20)
          while (remainingHeight > 0) {
            pdf.addPage()
            position = -pdf.internal.pageSize.getHeight() * (Math.ceil((finalHeight - remainingHeight) / pdf.internal.pageSize.getHeight()))
            pdf.addImage(imgData, 'PNG', xOffset, position, finalWidth, finalHeight)
            remainingHeight -= pdf.internal.pageSize.getHeight()
          }
        }

        pdf.save('dashboard.pdf')
        
        // Restore original gradient styles
        originalStyles.forEach(({ element, color, background, webkitTextFillColor }) => {
          element.style.color = color
          element.style.background = background
          element.style.webkitTextFillColor = webkitTextFillColor
        })

        // Restore export button visibility
        if (exportButton) {
          exportButton.style.display = originalButtonDisplay
        }
      })
      .catch((err) => {
        // Restore original gradient styles even on error
        originalStyles.forEach(({ element, color, background, webkitTextFillColor }) => {
          element.style.color = color
          element.style.background = background
          element.style.webkitTextFillColor = webkitTextFillColor
        })

        // Restore export button visibility even on error
        if (exportButton) {
          exportButton.style.display = originalButtonDisplay
        }
        
        // Fallback alert
        // eslint-disable-next-line no-console
        console.error('Failed to export PDF', err)
        alert('Failed to export PDF. See console for details.')
      })
  }

  return (
  <div id="dashboard-root" className="p-4">
      {/* Mobile Filters - Above title on mobile only */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center gap-2">
          {/* Period Filter */}
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value as 'day' | 'week' | 'month')}
            className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs flex-shrink-0"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          
          {/* Date Filter */}
          <div className="flex items-center gap-1 flex-1">
            <Calendar size={14} className="text-gray-600 dark:text-white flex-shrink-0" />
            <input
              {...getDateInputProps()}
              className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs w-full"
            />
          </div>
          
          {/* Mobile Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="export-pdf-button flex items-center gap-1 px-2 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-xs flex-shrink-0"
          >
            <Download size={14} />
          </motion.button>
        </div>
      </div>

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
        <div className="hidden sm:flex flex-shrink-0 items-center gap-3">
          {/* Period Filter - Desktop only */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value as 'day' | 'week' | 'month')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          
          {/* Date Filter - Desktop only */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600 dark:text-white" />
            <input
              {...getDateInputProps()}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
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
          { label: 'Total Calls', value: filteredKPIs.totalCallsToday, color: 'from-purple-500 to-pink-500' },
          { label: 'Avg cost per call', value: filteredKPIs.avgCostPerCall, color: 'from-blue-500 to-cyan-500' },
          { label: 'Average Response Time', value: filteredKPIs.avgResponseTime, color: 'from-green-500 to-emerald-500' },
          { label: 'Average Resolution Time', value: filteredKPIs.avgResolutionTime, color: 'from-cyan-500 to-blue-500' },
          { label: 'Total Cost', value: filteredKPIs.cost, color: 'from-amber-500 to-orange-500' },
          { label: 'Latency', value: filteredKPIs.latency, color: 'from-red-500 to-orange-500' }
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{kpi.label}</p>
            <p className={`text-sm sm:text-xl font-bold text-black dark:text-white`}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <PieChart
            data={filteredIntentCountData}
            title="Intent Count"
            description={`Distribution of call intents for ${selectedPeriod === 'day' ? selectedDate : `this ${selectedPeriod}`}`}
          />
        </div>

        <div>
          <BarChart
            data={{
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
            }}
            title="Sentiment Analysis"
            description={`Customer sentiment distribution for ${selectedPeriod === 'day' ? selectedDate : `this ${selectedPeriod}`}`}
            showPercentage={true}
          />
        </div>
      </div>
    </div>
  )
}
