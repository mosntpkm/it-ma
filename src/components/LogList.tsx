import React from 'react';
import type { MaintenanceLog } from '../types';
import { LogItem } from './LogItem';
import { ClipboardListIcon } from './icons';

interface LogListProps {
  logs: MaintenanceLog[];
}

export const LogList: React.FC<LogListProps> = ({ logs }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold mb-6 text-slate-700 border-b border-slate-200 pb-4">Maintenance History</h2>
      {logs.length === 0 ? (
        <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center h-full">
          <ClipboardListIcon className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-lg font-semibold text-slate-600">No maintenance logs found.</p>
          <p>Create a new log on the left to get started.</p>
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