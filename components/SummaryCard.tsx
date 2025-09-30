
import React from 'react';
import { LeaveType, LeaveConfig } from '../types';

interface SummaryCardProps {
  type: LeaveType;
  config: LeaveConfig;
  totalHoursUsed: number;
  hoursPerDay: number;
}

const formatTime = (totalHours: number, hoursPerDay: number): string => {
  if (totalHours === 0) return '0 days & 0 hours';
  const days = Math.floor(totalHours / hoursPerDay);
  const hours = totalHours % hoursPerDay;
  return `${days} ${days === 1 ? 'day' : 'days'} & ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ type, config, totalHoursUsed, hoursPerDay }) => {
  const totalDaysUsed = totalHoursUsed / hoursPerDay;
  const remainingDays = config.maxDays - totalDaysUsed;
  const percentageUsed = (totalDaysUsed / config.maxDays) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{type}</p>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{config.label}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold text-white ${config.color} rounded-full`}>
            {config.description}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Used:</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatTime(totalHoursUsed, hoursPerDay)}
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">Remaining:</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {remainingDays.toFixed(2)} days
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`${config.color} h-2.5 rounded-full`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
        <p className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">{percentageUsed.toFixed(1)}% used</p>
      </div>
    </div>
  );
};

export default SummaryCard;
