import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { LeaveEntry, LeaveType } from '../types';
import { LEAVE_CONFIG } from '../constants';

Chart.register(...registerables);

interface StatisticsDashboardProps {
  entries: LeaveEntry[];
  isDarkMode: boolean;
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ entries, isDarkMode }) => {
  const distributionChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyUsageChartRef = useRef<HTMLCanvasElement>(null);
  const distributionChartInstance = useRef<Chart | null>(null);
  const monthlyUsageChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const totals = {
      [LeaveType.ZOR]: 0,
      [LeaveType.DOK]: 0,
      [LeaveType.THU]: 0,
    };
    entries.forEach(entry => {
      totals[entry.type] += entry.hours;
    });

    const monthlyUsage: { [key: string]: number } = {};
    const monthLabels = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthLabels.push(monthKey);
        monthlyUsage[monthKey] = 0;
    }

    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const monthKey = entryDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyUsage.hasOwnProperty(monthKey)) {
        monthlyUsage[monthKey] += entry.hours;
      }
    });

    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    if (distributionChartRef.current) {
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
      }
      const distributionCtx = distributionChartRef.current.getContext('2d');
      if (distributionCtx) {
        distributionChartInstance.current = new Chart(distributionCtx, {
          type: 'doughnut',
          data: {
            labels: Object.values(LeaveType).map(type => LEAVE_CONFIG[type].label),
            datasets: [{
              label: 'Hours Used',
              data: Object.values(totals),
              backgroundColor: Object.values(LeaveType).map(type => {
                  const colorClass = LEAVE_CONFIG[type].color;
                  if (colorClass.includes('blue')) return '#3b82f6';
                  if (colorClass.includes('green')) return '#22c55e';
                  if (colorClass.includes('purple')) return '#8b5cf6';
                  return '#6b7280';
              }),
              borderColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderWidth: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: textColor }
              },
              title: {
                display: true,
                text: 'Leave Type Distribution',
                color: textColor,
                font: { size: 16 }
              }
            }
          }
        });
      }
    }

    if (monthlyUsageChartRef.current) {
      if (monthlyUsageChartInstance.current) {
        monthlyUsageChartInstance.current.destroy();
      }
      const monthlyUsageCtx = monthlyUsageChartRef.current.getContext('2d');
      if (monthlyUsageCtx) {
        monthlyUsageChartInstance.current = new Chart(monthlyUsageCtx, {
          type: 'bar',
          data: {
            labels: monthLabels,
            datasets: [{
              label: 'Total Hours per Month',
              data: monthLabels.map(label => monthlyUsage[label] || 0),
              backgroundColor: 'rgba(99, 102, 241, 0.6)',
              borderColor: 'rgba(99, 102, 241, 1)',
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: textColor },
                grid: { color: gridColor }
              },
              x: {
                ticks: { color: textColor },
                grid: { color: gridColor }
              }
            },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Monthly Usage (Last 6 Months)',
                color: textColor,
                font: { size: 16 }
              }
            }
          }
        });
      }
    }
    
    return () => {
        distributionChartInstance.current?.destroy();
        monthlyUsageChartInstance.current?.destroy();
    }
  }, [entries, isDarkMode]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80">
        <div className="relative">
          <canvas ref={distributionChartRef}></canvas>
        </div>
        <div className="relative">
          <canvas ref={monthlyUsageChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
