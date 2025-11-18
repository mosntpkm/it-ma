import React from 'react';
import type { MaintenanceLog } from '../types';
import { LogStatus } from '../types';

interface LogItemProps {
  log: MaintenanceLog;
}

const getStatusColor = (status: LogStatus): string => {
  switch (status) {
    case LogStatus.RESOLVED:
    case LogStatus.CLOSED:
      return 'bg-green-100 text-green-800';
    case LogStatus.PENDING_PARTS:
      return 'bg-yellow-100 text-yellow-800';
    case LogStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case LogStatus.REPORTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900">{log.computerModel}</h3>
          <p className="text-sm text-gray-500">S/N: {log.serialNumber}</p>
          {log.ipAddress && <p className="text-sm text-gray-500">IP: {log.ipAddress}</p>}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(log.status)}`}>
          {log.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-3">
        Logged on {new Date(log.logDate).toLocaleString()} for <span className="font-medium text-gray-700">{log.owner}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {log.imageUrl && (
          <div className="md:col-span-1">
            <img 
              src={log.imageUrl} 
              alt={`Issue with ${log.computerModel}`} 
              className="rounded-md object-cover w-full h-40 bg-gray-200"
            />
          </div>
        )}
        <div className={log.imageUrl ? 'md:col-span-1' : 'md:col-span-2'}>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-blue-600 hover:underline">View Details</summary>
            <div className="mt-2 space-y-3 pt-2 border-t">
              <div>
                <h4 className="font-semibold text-gray-700">Reported Issue:</h4>
                <p className="text-gray-600">{log.reportedIssue}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Diagnosis:</h4>
                <p className="text-gray-600">{log.diagnosis}</p>
              </div>
               <div>
                <h4 className="font-semibold text-gray-700">Actions Taken:</h4>
                <p className="text-gray-600">{log.actionsTaken}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
