import React, { useState, useRef, useCallback } from 'react';
import type { MaintenanceLog } from '../types';
import { LogStatus } from '../types';
import { CameraIcon, UploadIcon, TrashIcon } from './icons';

interface MaintenanceFormProps {
  onSubmit: (log: MaintenanceLog) => void;
}

const InputField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, placeholder?: string }> = 
    ({ id, label, value, onChange, required, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      />
    </div>
);

const TextAreaField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean, rows?: number, placeholder?: string }> =
    ({ id, label, value, onChange, required, rows = 3, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      />
    </div>
);

const SelectField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode, required?: boolean }> =
    ({ id, label, value, onChange, children, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 bg-slate-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
            {children}
        </select>
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

    // Simulate API call
    setTimeout(() => {
        onSubmit(newLog);
        resetForm();
        setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-4">Create New Maintenance Log</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="computerModel" label="Computer Model / Asset Tag" value={computerModel} onChange={e => setComputerModel(e.target.value)} required placeholder="e.g., Dell Latitude 7420" />
        <InputField id="serialNumber" label="Serial Number" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required placeholder="e.g., 5CG1234XYZ" />
        <InputField id="owner" label="User / Department" value={owner} onChange={e => setOwner(e.target.value)} required placeholder="e.g., John Doe / Marketing" />
        <InputField id="ipAddress" label="IP Address (Optional)" value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="e.g., 192.168.1.100" />
        <TextAreaField id="reportedIssue" label="Reported Issue" value={reportedIssue} onChange={e => setReportedIssue(e.target.value)} required placeholder="Describe the problem reported by the user" />
        <TextAreaField id="diagnosis" label="IT Diagnosis / Analysis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required placeholder="Your analysis of the root cause" />
        <TextAreaField id="actionsTaken" label="Actions Taken / Solution" value={actionsTaken} onChange={e => setActionsTaken(e.target.value)} required placeholder="List the steps taken to resolve the issue" />

        <SelectField id="status" label="Status" value={status} onChange={e => setStatus(e.target.value as LogStatus)} required>
          {Object.values(LogStatus).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </SelectField>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Photo</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => triggerFileInput(true)} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                    <CameraIcon className="h-5 w-5 mr-2" /> Take Photo
                </button>
                 <button type="button" onClick={() => triggerFileInput(false)} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                    <UploadIcon className="h-5 w-5 mr-2" /> Upload File
                </button>
            </div>
        </div>

        {image && (
          <div className="mt-4 relative">
            <img src={image} alt="Preview" className="w-full rounded-md shadow-inner max-h-60 object-contain bg-gray-100" />
             <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? 'Saving...' : 'Save Log Entry'}
        </button>
      </form>
    </div>
  );
};
