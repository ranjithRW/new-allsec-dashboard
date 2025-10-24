import { BarChart3, Phone, ChevronLeft, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'cx-reports', label: 'CX Reports', icon: BarChart3 },
    { id: 'call-history', label: 'Call History', icon: Phone }
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ 
          x: isOpen ? 0 : -300, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40 w-64 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
        >
          <X size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <nav className="p-4 space-y-2 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft
            size={14}
            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''} dark:text-white text-gray-600`}
          />
        </motion.button>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                }`}
              >
                <motion.div>
                  <Icon size={20} className="flex-shrink-0" />
                </motion.div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
