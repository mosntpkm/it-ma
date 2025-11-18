import React from 'react';
import type { MaintenanceLog } from '../types';
import { LogStatus } from '../types';
import { ChevronDownIcon } from './icons';

interface LogItemProps {
  log: MaintenanceLog;
}

const getStatusStyles = (status: LogStatus): { dot: string, text: string } => {
  switch (status) {
    case LogStatus.RESOLVED:
    case LogStatus.CLOSED:
      return { dot: 'bg-green-500', text: 'text-green-700' };
    case LogStatus.PENDING_PARTS:
      return { dot: 'bg-yellow-500', text: 'text-yellow-700' };
    case LogStatus.IN_PROGRESS:
      return { dot: 'bg-blue-500', text: 'text-blue-700' };
    case LogStatus.REPORTED:
      return { dot: 'bg-red-500', text: 'text-red-700' };
    default:
      return { dot: 'bg-slate-500', text: 'text-slate-700' };
  }
};

const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-slate-700">{title}:</h4>
        <p className="text-slate-600 whitespace-pre-wrap">{children}</p>
    </div>
);

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
  const statusStyles = getStatusStyles(log.status);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 group/item">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800">{log.computerModel}</h3>
          <p className="text-sm text-slate-500">S/N: {log.serialNumber}</p>
          {log.ipAddress && <p className="text-sm text-slate-500">IP: {log.ipAddress}</p>}
        </div>
        <div className="flex items-center space-x-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot}`}></div>
            <span className={`text-sm font-semibold ${statusStyles.text}`}>
                {log.status}
            </span>
        </div>
      </div>
      
      <div className="text-sm text-slate-500 mb-4 border-b border-slate-200 pb-3">
        Logged on {new Date(log.logDate).toLocaleString()} for <span className="font-medium text-slate-700">{log.owner}</span>
      </div>

      <details className="group/details">
        <summary className="list-none flex justify-between items-center cursor-pointer font-medium text-indigo-600 hover:underline">
          <span>View Details</span>
          <ChevronDownIcon className="h-5 w-5 transition-transform duration-200 group-open/details:rotate-180" />
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {log.imageUrl && (
                <div className="md:col-span-1">
                    <img 
                    src={log.imageUrl} 
                    alt={`Issue with ${log.computerModel}`} 
                    className="rounded-md object-cover w-full h-48 bg-slate-200 border border-slate-300"
                    />
                </div>
            )}
            <div className={`${log.imageUrl ? 'md:col-span-1' : 'md:col-span-2'} space-y-3`}>
                <DetailSection title="Reported Issue">{log.reportedIssue}</DetailSection>
                <DetailSection title="Diagnosis">{log.diagnosis}</DetailSection>
                <DetailSection title="Actions Taken">{log.actionsTaken}</DetailSection>
            </div>
        </div>
      </details>
    </div>
  );
};