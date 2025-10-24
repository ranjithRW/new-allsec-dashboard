export const callHistoryKPI = {
  totalCalls: 56,
  avgCallDuration: '1 min 37 s',
  resolutionRate: '25%',
  escalationRate: '19%'
};

export const cxReportsKPI = {
  intentRecognition: 'UP/Down this week',
  avgResponseTime: '1 minute',
  csatScore: '7.8/10',
  sentimentAnalysis: 'Positive: 60%, Negative: 30%',
  avgResolutionTime: '3 minutes',
  unassignedTickets: 5
};

export const intentAccuracyData = {
  labels: ['Fraud', 'Disputes', 'Late Payment', 'Balance', 'Credit Report', 'T&C'],
  aiHandled: [120, 80, 90, 150, 70, 130],
  escalated: [30, 100, 60, 40, 50, 50]
};

export const ticketStatusByWeek = {
  week1: { open: 12, resolved: 8 },
  week2: { open: 15, resolved: 10 },
  week3: { open: 18, resolved: 14 },
  week4: { open: 22, resolved: 16 }
};

// Function to get current week of the month
export const getCurrentWeekOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const pastDaysOfMonth = now.getDate() - 1;
  return Math.ceil((pastDaysOfMonth + firstDay.getDay() + 1) / 7);
};

// Function to generate dynamic week data based on current week
export const getDynamicWeekData = () => {
  const currentWeek = getCurrentWeekOfMonth();
  const weeks = [];
  
  for (let i = 1; i <= currentWeek; i++) {
    const weekKey = `week${i}` as keyof typeof ticketStatusByWeek;
    if (ticketStatusByWeek[weekKey]) {
      weeks.push({
        week: `Week ${i}`,
        open: ticketStatusByWeek[weekKey].open,
        resolved: ticketStatusByWeek[weekKey].resolved
      });
    }
  }
  
  return weeks;
};

export const callHistoryRecords = [
  {
    id: '1',
    caller: 'John Smith',
    agent: 'AI Agent 1',
    duration: '2:34',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported suspicious transaction on their credit card ending in 4532. Agent verified identity and initiated fraud investigation process.',
    date: '2025-10-23 09:15'
  },
  {
    id: '2',
    caller: 'Sarah Johnson',
    agent: 'AI Agent 2',
    duration: '1:12',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer inquired about current account balance and recent transactions. Agent provided balance information and confirmed last payment received.',
    date: '2025-10-23 10:30'
  },
  {
    id: '3',
    caller: 'Mike Wilson',
    agent: 'AI Agent 1',
    duration: '3:45',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $129.99 from merchant XYZ. Agent documented dispute details and initiated chargeback process.',
    date: '2025-10-23 11:45'
  },
  {
    id: '4',
    caller: 'Emma Davis',
    agent: 'AI Agent 3',
    duration: '1:55',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date from 15th to 1st of each month. Agent processed the request successfully.',
    date: '2025-10-23 13:20'
  },
  {
    id: '5',
    caller: 'David Lee',
    agent: 'AI Agent 2',
    duration: '2:18',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service. Agent confirmed bank account details and set up recurring payments.',
    date: '2025-10-23 14:50'
  }
];

export const reportTypes = [
  { id: 'fraud', label: 'Fraud Reporting', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'disputes', label: 'Change Disputes', color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'due-date', label: 'Due Date Changes', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'credit-report', label: 'Credit Report Disputes', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'auto-pay', label: 'Auto-pay enrollment', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  { id: 'balance', label: 'Balance Enquiry', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'customer-trade', label: 'Customer Trade Lines', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'tnc', label: 'T&C requests', color: 'bg-orange-100 text-orange-700 border-orange-300' }
];
