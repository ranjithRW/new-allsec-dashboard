import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
    colors: string[];
    borderColors: string[];
  };
  title?: string;
  description?: string;
  height?: string;
}

export default function PieChart({ 
  data, 
  title, 
  description, 
  height = "h-64 sm:h-80" 
}: PieChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Count',
        data: data.values,
        backgroundColor: data.colors,
        borderColor: data.borderColors,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { size: 12 },
          padding: 15,
          usePointStyle: true
        }
      },
      title: {
        display: false
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          {description}
        </p>
      )}
      <div className={height}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}