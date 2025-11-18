
import React, { useState } from 'react';
import type { MaintenanceLog } from './types';
import { MaintenanceForm } from './components/MaintenanceForm';
import { LogList } from './components/LogList';
import { ComputerIcon } from './components/icons';

const App: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);

  const addLog = (log: MaintenanceLog) => {
    setLogs(prevLogs => [log, ...prevLogs]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ComputerIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              IT Support Maintenance Log
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <MaintenanceForm onSubmit={addLog} />
        </div>
        <div className="lg:col-span-3">
          <LogList logs={logs} />
        </div>
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} IT Support Division. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
