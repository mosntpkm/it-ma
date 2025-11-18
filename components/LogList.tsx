
import React from 'react';
import type { MaintenanceLog } from '../types';
import { LogItem } from './LogItem';

interface LogListProps {
  logs: MaintenanceLog[];
}

export const LogList: React.FC<LogListProps> = ({ logs }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-4">Maintenance History</h2>
      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No maintenance logs yet.</p>
          <p>Create a new log to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {logs.map(log => (
            <LogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};
