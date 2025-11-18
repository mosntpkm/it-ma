import React, { useState, useRef, useCallback } from 'react';
import type { MaintenanceLog } from '../types';
import { LogStatus } from '../types';
import { CameraIcon, UploadIcon, TrashIcon } from './icons';

interface MaintenanceFormProps {
  onSubmit: (log: MaintenanceLog) => void;
}

const FormField: React.FC<{ children: React.ReactNode; label: string; htmlFor: string }> = ({ children, label, htmlFor }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
);

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit }) => {
  const [computerModel, setComputerModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [reportedIssue, setReportedIssue] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [status, setStatus] = useState<LogStatus>(LogStatus.REPORTED);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (capture: boolean) => {
    if (fileInputRef.current) {
        if(capture) {
            fileInputRef.current.setAttribute('capture', 'environment');
        } else {
            fileInputRef.current.removeAttribute('capture');
        }
        fileInputRef.current.click();
    }
  };
  
  const clearImage = () => {
    setImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const resetForm = useCallback(() => {
    setComputerModel('');
    setSerialNumber('');
    setOwner('');
    setIpAddress('');
    setReportedIssue('');
    setDiagnosis('');
    setActionsTaken('');
    setStatus(LogStatus.REPORTED);
    clearImage();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const newLog: MaintenanceLog = {
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
      computerModel,
      serialNumber,
      owner,
      ipAddress: ipAddress || undefined,
      reportedIssue,
      diagnosis,
      actionsTaken,
      status,
      imageUrl: image || undefined,
      logDate: new Date().toISOString(),
    };

    setTimeout(() => {
        onSubmit(newLog);
        resetForm();
        setIsSubmitting(false);
    }, 500);
  };

  const inputClasses = "w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-slate-700 border-b border-slate-200 pb-4">Create New Maintenance Log</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-slate-600 mb-2">Device Information</legend>
            <FormField label="Computer Model / Asset Tag" htmlFor="computerModel">
                <input id="computerModel" type="text" value={computerModel} onChange={e => setComputerModel(e.target.value)} required placeholder="e.g., Dell Latitude 7420" className={inputClasses} />
            </FormField>
             <FormField label="Serial Number" htmlFor="serialNumber">
                <input id="serialNumber" type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required placeholder="e.g., 5CG1234XYZ" className={inputClasses} />
            </FormField>
            <FormField label="User / Department" htmlFor="owner">
                <input id="owner" type="text" value={owner} onChange={e => setOwner(e.target.value)} required placeholder="e.g., John Doe / Marketing" className={inputClasses} />
            </FormField>
             <FormField label="IP Address (Optional)" htmlFor="ipAddress">
                <input id="ipAddress" type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="e.g., 192.168.1.100" className={inputClasses} />
            </FormField>
        </fieldset>
        
        <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-slate-600 mb-2">Issue Details</legend>
            <FormField label="Reported Issue" htmlFor="reportedIssue">
                <textarea id="reportedIssue" value={reportedIssue} onChange={e => setReportedIssue(e.target.value)} required placeholder="Describe the problem reported by the user" rows={4} className={inputClasses} />
            </FormField>
            <FormField label="IT Diagnosis / Analysis" htmlFor="diagnosis">
                <textarea id="diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required placeholder="Your analysis of the root cause" rows={4} className={inputClasses} />
            </FormField>
            <FormField label="Actions Taken / Solution" htmlFor="actionsTaken">
                <textarea id="actionsTaken" value={actionsTaken} onChange={e => setActionsTaken(e.target.value)} required placeholder="List the steps taken to resolve the issue" rows={4} className={inputClasses} />
            </FormField>
        </fieldset>

        <fieldset className="space-y-4">
             <legend className="text-lg font-semibold text-slate-600 mb-2">Status & Attachments</legend>
            <FormField label="Status" htmlFor="status">
                <select id="status" value={status} onChange={e => setStatus(e.target.value as LogStatus)} required className={inputClasses}>
                {Object.values(LogStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
                </select>
            </FormField>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attach Photo</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => triggerFileInput(true)} className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        <CameraIcon className="h-5 w-5 mr-2" /> Take Photo
                    </button>
                    <button type="button" onClick={() => triggerFileInput(false)} className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        <UploadIcon className="h-5 w-5 mr-2" /> Upload File
                    </button>
                </div>
            </div>

            {image && (
            <div className="mt-4 relative group">
                <img src={image} alt="Preview" className="w-full rounded-md shadow-inner max-h-60 object-contain bg-slate-100 border border-slate-200" />
                <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
            )}
        </fieldset>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? 'Saving...' : 'Save Log Entry'}
        </button>
      </form>
    </div>
  );
};