export const callHistoryKPI = {
  totalCalls: 56,
  avgCallDuration: '1 min 37 s',
  resolutionRate: '25%',
  escalationRate: '19%'
};

export const cxReportsKPI = {
  intentRecognition: 'UP/Down this week',
  avgResponseTime: '1 minute',
  cost: '$1200',
  totalCallsToday: 15, // This will be dynamically calculated
  avgResolutionTime: '3 minutes',
  unassignedTickets: 5
};

// Function to get total calls for a specific date
export const getTotalCallsForDate = (date: string): number => {
  return callHistoryRecords.filter(record => {
    const recordDate = record.date.split(' ')[0]; // Extract date part (YYYY-MM-DD)
    return recordDate === date;
  }).length;
};

// Function to get calls for date range
export const getCallsForDateRange = (startDate: string, endDate: string) => {
  return callHistoryRecords.filter(record => {
    const recordDate = record.date.split(' ')[0]; // Extract date part (YYYY-MM-DD)
    return recordDate >= startDate && recordDate <= endDate;
  });
};

export const intentAccuracyData = {
  labels: ['Fraud', 'Disputes', 'Late Payment', 'Balance', 'Credit Report', 'T&C'],
  aiHandled: [120, 80, 90, 150, 70, 130],
  escalated: [30, 100, 60, 40, 50, 50]
};

export const sentimentAnalysisData = {
  labels: ['Positive', 'Neutral', 'Negative'],
  values: [60, 25, 15],
  colors: [
    'rgba(34, 197, 94, 0.8)',   // Green for Positive
    'rgba(156, 163, 175, 0.8)', // Gray for Neutral
    'rgba(239, 68, 68, 0.8)'    // Red for Negative
  ],
  borderColors: [
    'rgba(34, 197, 94, 1)',
    'rgba(156, 163, 175, 1)',
    'rgba(239, 68, 68, 1)'
  ]
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
  // 2025-10-23 Records (Today - 15 records)
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
  },
  {
    id: '6',
    caller: 'Lisa Brown',
    agent: 'AI Agent 1',
    duration: '4:12',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed inaccurate information on their credit report. Agent initiated dispute process with credit bureau.',
    date: '2025-10-23 08:30'
  },
  {
    id: '7',
    caller: 'Robert Taylor',
    agent: 'AI Agent 3',
    duration: '2:45',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested information about their trade lines and payment history. Agent provided detailed account information.',
    date: '2025-10-23 15:30'
  },
  {
    id: '8',
    caller: 'Jennifer White',
    agent: 'AI Agent 2',
    duration: '1:55',
    intent: 'T&C requests',
    audio: 'available',
    transcript: 'Customer requested copy of terms and conditions. Agent provided updated T&C document via email.',
    date: '2025-10-23 11:20'
  },
  {
    id: '9',
    caller: 'Michael Chen',
    agent: 'AI Agent 1',
    duration: '3:30',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported unauthorized charges on their account. Agent immediately blocked the card and initiated fraud investigation.',
    date: '2025-10-23 16:10'
  },
  {
    id: '10',
    caller: 'Amanda Garcia',
    agent: 'AI Agent 3',
    duration: '1:45',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer checked their current balance and recent transactions. Agent confirmed account status and provided transaction history.',
    date: '2025-10-23 14:25'
  },
  {
    id: '11',
    caller: 'James Wilson',
    agent: 'AI Agent 2',
    duration: '2:15',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $89.99 from online retailer. Agent documented the dispute and initiated investigation.',
    date: '2025-10-23 12:45'
  },
  {
    id: '12',
    caller: 'Maria Rodriguez',
    agent: 'AI Agent 1',
    duration: '1:30',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date to the 25th of each month. Agent processed the request.',
    date: '2025-10-23 17:20'
  },
  {
    id: '13',
    caller: 'Kevin Thompson',
    agent: 'AI Agent 3',
    duration: '3:20',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service with checking account. Agent confirmed bank details and set up recurring payments.',
    date: '2025-10-23 10:15'
  },
  {
    id: '14',
    caller: 'Rachel Green',
    agent: 'AI Agent 2',
    duration: '2:50',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed late payment mark on credit report. Agent initiated dispute process with credit bureau.',
    date: '2025-10-23 13:45'
  },
  {
    id: '15',
    caller: 'Tom Anderson',
    agent: 'AI Agent 1',
    duration: '1:25',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested information about their payment history and trade line status. Agent provided account details.',
    date: '2025-10-23 16:30'
  },

  // 2025-10-22 Records (Yesterday - 12 records)
  {
    id: '16',
    caller: 'Susan Miller',
    agent: 'AI Agent 3',
    duration: '2:10',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported suspicious activity on their account. Agent verified identity and initiated fraud investigation.',
    date: '2025-10-22 09:30'
  },
  {
    id: '17',
    caller: 'Daniel Kim',
    agent: 'AI Agent 2',
    duration: '1:40',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer inquired about current account balance and recent transactions. Agent provided balance information.',
    date: '2025-10-22 11:15'
  },
  {
    id: '18',
    caller: 'Patricia Johnson',
    agent: 'AI Agent 1',
    duration: '3:15',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $199.99 from subscription service. Agent documented dispute and initiated chargeback.',
    date: '2025-10-22 14:20'
  },
  {
    id: '19',
    caller: 'Mark Davis',
    agent: 'AI Agent 3',
    duration: '2:35',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date from 1st to 15th of each month. Agent processed the request.',
    date: '2025-10-22 16:45'
  },
  {
    id: '20',
    caller: 'Linda Brown',
    agent: 'AI Agent 2',
    duration: '1:55',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service with savings account. Agent confirmed account details and set up payments.',
    date: '2025-10-22 08:15'
  },
  {
    id: '21',
    caller: 'Christopher Lee',
    agent: 'AI Agent 1',
    duration: '4:20',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed multiple inaccuracies on credit report. Agent initiated comprehensive dispute process.',
    date: '2025-10-22 13:30'
  },
  {
    id: '22',
    caller: 'Nancy Wilson',
    agent: 'AI Agent 3',
    duration: '2:05',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested detailed information about their trade lines. Agent provided comprehensive account history.',
    date: '2025-10-22 15:10'
  },
  {
    id: '23',
    caller: 'Steven Garcia',
    agent: 'AI Agent 2',
    duration: '1:30',
    intent: 'T&C requests',
    audio: 'available',
    transcript: 'Customer requested updated terms and conditions document. Agent provided latest T&C via email.',
    date: '2025-10-22 10:45'
  },
  {
    id: '24',
    caller: 'Karen Martinez',
    agent: 'AI Agent 1',
    duration: '3:45',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported unauthorized transactions totaling $500. Agent immediately blocked account and initiated investigation.',
    date: '2025-10-22 17:25'
  },
  {
    id: '25',
    caller: 'Paul Thompson',
    agent: 'AI Agent 3',
    duration: '1:20',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer checked account balance and recent activity. Agent confirmed current balance and transaction history.',
    date: '2025-10-22 12:00'
  },
  {
    id: '26',
    caller: 'Donna White',
    agent: 'AI Agent 2',
    duration: '2:30',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $75.00 from utility company. Agent documented dispute and initiated investigation.',
    date: '2025-10-24 14:50'
  },
  {
    id: '27',
    caller: 'Richard Anderson',
    agent: 'AI Agent 1',
    duration: '1:45',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date to the 30th of each month. Agent processed the request successfully.',
    date: '2025-10-2411:30'
  },

  // 2025-10-21 Records (2 days ago - 10 records)
  {
    id: '28',
    caller: 'Betty Clark',
    agent: 'AI Agent 3',
    duration: '2:15',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service with credit card. Agent confirmed card details and set up recurring payments.',
    date: '2025-10-24 09:45'
  },
  {
    id: '29',
    caller: 'William Taylor',
    agent: 'AI Agent 2',
    duration: '3:30',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed collection account on credit report. Agent initiated dispute process with collection agency.',
    date: '2025-10-21 13:15'
  },
  {
    id: '30',
    caller: 'Helen Rodriguez',
    agent: 'AI Agent 1',
    duration: '1:50',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested information about their payment history. Agent provided detailed trade line information.',
    date: '2025-10-21 15:30'
  },
  {
    id: '31',
    caller: 'George Miller',
    agent: 'AI Agent 3',
    duration: '2:40',
    intent: 'T&C requests',
    audio: 'available',
    transcript: 'Customer requested copy of terms and conditions. Agent provided updated T&C document and explained key changes.',
    date: '2025-10-21 11:20'
  },
  {
    id: '32',
    caller: 'Dorothy Wilson',
    agent: 'AI Agent 2',
    duration: '4:15',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported multiple unauthorized charges. Agent immediately blocked all cards and initiated comprehensive fraud investigation.',
    date: '2025-10-21 16:10'
  },
  {
    id: '33',
    caller: 'Charles Brown',
    agent: 'AI Agent 1',
    duration: '1:25',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer inquired about account balance and recent transactions. Agent provided current balance information.',
    date: '2025-10-21 10:30'
  },
  {
    id: '34',
    caller: 'Ruth Davis',
    agent: 'AI Agent 3',
    duration: '2:55',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $150.00 from merchant. Agent documented dispute details and initiated chargeback process.',
    date: '2025-10-21 14:45'
  },
  {
    id: '35',
    caller: 'Frank Garcia',
    agent: 'AI Agent 2',
    duration: '1:35',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date to the 20th of each month. Agent processed the request.',
    date: '2025-10-21 12:15'
  },
  {
    id: '36',
    caller: 'Shirley Martinez',
    agent: 'AI Agent 1',
    duration: '3:20',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service with checking account. Agent confirmed bank details and set up automatic payments.',
    date: '2025-10-21 17:30'
  },
  {
    id: '37',
    caller: 'Raymond Thompson',
    agent: 'AI Agent 3',
    duration: '2:10',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed late payment notation on credit report. Agent initiated dispute process with credit bureau.',
    date: '2025-10-21 15:00'
  },

  // 2025-10-20 Records (3 days ago - 8 records)
  {
    id: '38',
    caller: 'Evelyn White',
    agent: 'AI Agent 2',
    duration: '1:40',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested information about their account status. Agent provided trade line details and payment history.',
    date: '2025-10-20 14:25'
  },
  {
    id: '39',
    caller: 'Harold Anderson',
    agent: 'AI Agent 1',
    duration: '2:25',
    intent: 'T&C requests',
    audio: 'available',
    transcript: 'Customer requested updated terms and conditions. Agent provided latest T&C document and highlighted key changes.',
    date: '2025-10-20 11:45'
  },
  {
    id: '40',
    caller: 'Mildred Clark',
    agent: 'AI Agent 3',
    duration: '3:50',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported suspicious activity and unauthorized transactions. Agent immediately secured account and initiated fraud investigation.',
    date: '2025-10-20 16:20'
  },
  {
    id: '41',
    caller: 'Arthur Taylor',
    agent: 'AI Agent 2',
    duration: '1:15',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer checked current account balance. Agent provided balance information and recent transaction summary.',
    date: '2025-10-20 09:30'
  },
  {
    id: '42',
    caller: 'Lois Rodriguez',
    agent: 'AI Agent 1',
    duration: '2:35',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $299.99 from subscription service. Agent documented dispute and initiated chargeback process.',
    date: '2025-10-20 13:15'
  },
  {
    id: '43',
    caller: 'Albert Miller',
    agent: 'AI Agent 3',
    duration: '1:50',
    intent: 'Due Date Changes',
    audio: 'available',
    transcript: 'Customer requested to change payment due date to the 5th of each month. Agent processed the request successfully.',
    date: '2025-10-20 15:40'
  },
  {
    id: '44',
    caller: 'Frances Wilson',
    agent: 'AI Agent 2',
    duration: '2:20',
    intent: 'Auto-pay Enrollment',
    audio: 'available',
    transcript: 'Customer enrolled in auto-pay service with savings account. Agent confirmed account details and set up recurring payments.',
    date: '2025-10-20 10:15'
  },
  {
    id: '45',
    caller: 'Louis Brown',
    agent: 'AI Agent 1',
    duration: '3:10',
    intent: 'Credit Report Disputes',
    audio: 'available',
    transcript: 'Customer disputed multiple inaccuracies on credit report. Agent initiated comprehensive dispute process with credit bureau.',
    date: '2025-10-20 14:50'
  },

  // 2025-10-19 Records (4 days ago - 5 records)
  {
    id: '46',
    caller: 'Virginia Davis',
    agent: 'AI Agent 3',
    duration: '1:30',
    intent: 'Customer Trade Lines',
    audio: 'available',
    transcript: 'Customer requested information about their payment history. Agent provided detailed trade line information.',
    date: '2025-10-19 12:30'
  },
  {
    id: '47',
    caller: 'Howard Garcia',
    agent: 'AI Agent 2',
    duration: '2:45',
    intent: 'T&C requests',
    audio: 'available',
    transcript: 'Customer requested copy of terms and conditions. Agent provided updated T&C document via email.',
    date: '2025-10-19 15:20'
  },
  {
    id: '48',
    caller: 'Ruth Martinez',
    agent: 'AI Agent 1',
    duration: '4:25',
    intent: 'Fraud Reporting',
    audio: 'available',
    transcript: 'Customer reported extensive unauthorized activity on multiple accounts. Agent immediately secured all accounts and initiated comprehensive fraud investigation.',
    date: '2025-10-19 17:45'
  },
  {
    id: '49',
    caller: 'Eugene Thompson',
    agent: 'AI Agent 3',
    duration: '1:55',
    intent: 'Balance Enquiry',
    audio: 'available',
    transcript: 'Customer inquired about current account balance and recent transactions. Agent provided balance information and transaction history.',
    date: '2025-10-19 11:10'
  },
  {
    id: '50',
    caller: 'Marie White',
    agent: 'AI Agent 2',
    duration: '2:15',
    intent: 'Change Disputes',
    audio: 'available',
    transcript: 'Customer disputed a charge of $89.99 from online retailer. Agent documented dispute details and initiated investigation.',
    date: '2025-10-19 14:00'
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
