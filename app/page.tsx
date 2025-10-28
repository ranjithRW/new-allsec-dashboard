'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import CXReports from '../components/pages/CXReports'
import CallHistory from '../components/pages/CallHistory'
import { ThemeProvider } from '../contexts/ThemeContext'

export default function Home() {
  const [activeSection, setActiveSection] = useState('cx-reports')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'cx-reports':
        return <CXReports />
      case 'call-history':
        return <CallHistory />
      default:
        return <CXReports />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="pt-16 lg:pt-20 lg:pl-64 transition-all duration-300">
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  )
}
