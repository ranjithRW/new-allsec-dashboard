import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CXReports from './CXReports';
import CallHistory from './CallHistory';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('cx-reports');

  const renderContent = () => {
    switch (activeSection) {
      case 'cx-reports':
        return <CXReports />;
      case 'call-history':
        return <CallHistory />;
      default:
        return <CXReports />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="pt-20 pl-64 transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
}
