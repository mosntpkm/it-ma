
import React, { useState, useEffect } from 'react';
import type { MaintenanceLog, CreateLogDTO } from './types';
import { LogStatus } from './types';
import { MaintenanceForm } from './components/MaintenanceForm';
import { LogList } from './components/LogList';
import { ComputerIcon } from './components/icons';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs from Supabase
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .order('log_date', { ascending: false });

      if (error) throw error;

      // Map snake_case DB columns to camelCase TS Interface
      const formattedLogs: MaintenanceLog[] = (data || []).map((item: any) => ({
        id: item.id,
        computerModel: item.computer_model,
        serialNumber: item.serial_number,
        owner: item.owner,
        ipAddress: item.ip_address,
        reportedIssue: item.reported_issue,
        diagnosis: item.diagnosis,
        actionsTaken: item.actions_taken,
        status: item.status as LogStatus,
        imageUrl: item.image_url,
        logDate: item.log_date
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateLog = async (logData: CreateLogDTO, file: File | null) => {
    try {
      let publicImageUrl = null;

      // 1. Upload Image if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('maintenance-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('maintenance-images')
          .getPublicUrl(filePath);

        publicImageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Data into Supabase
      const { error: insertError } = await supabase
        .from('maintenance_logs')
        .insert([
          {
            computer_model: logData.computerModel,
            serial_number: logData.serialNumber,
            owner: logData.owner,
            ip_address: logData.ipAddress,
            reported_issue: logData.reportedIssue,
            diagnosis: logData.diagnosis,
            actions_taken: logData.actionsTaken,
            status: logData.status,
            image_url: publicImageUrl,
            log_date: new Date().toISOString(), // Use client time or let DB handle default
          },
        ]);

      if (insertError) throw insertError;

      // 3. Refresh List
      await fetchLogs();

    } catch (error) {
      console.error("Error creating log:", error);
      throw error; // Let form handle error display
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <ComputerIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              IT Maintenance Log
            </h1>
          </div>
          <div className="hidden md:block text-sm text-slate-500 font-medium">
             Support Dashboard
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <MaintenanceForm onSubmit={handleCreateLog} />
        </div>
        <div className="lg:col-span-7 xl:col-span-8 h-full">
          {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-lg h-40 flex items-center justify-center">
                  <p className="text-slate-500">Loading records...</p>
              </div>
          ) : (
            <LogList logs={logs} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="container mx-auto py-6 px-4 text-center">
            <p className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} IT Support Division. Secured & Private.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
