
import React, { useState, useRef, useCallback } from 'react';
import type { CreateLogDTO } from '../types';
import { LogStatus } from '../types';
import { CameraIcon, UploadIcon, TrashIcon } from './icons';

interface MaintenanceFormProps {
  onSubmit: (data: CreateLogDTO, file: File | null) => Promise<void>;
}

const FormField: React.FC<{ children: React.ReactNode; label: string; htmlFor: string }> = ({ children, label, htmlFor }) => (
    <div className="mb-3">
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
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
  
  // Store the actual file for upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Store preview URL
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
    setImageFile(null);
    setImagePreview(null);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const logData: CreateLogDTO = {
      computerModel,
      serialNumber,
      owner,
      ipAddress: ipAddress || undefined,
      reportedIssue,
      diagnosis,
      actionsTaken,
      status,
      imageUrl: undefined, // URL will be generated in App.tsx after upload
    };

    try {
        await onSubmit(logData, imageFile);
        resetForm();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to save log. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-slate-900 placeholder-slate-400 sm:text-sm";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 sticky top-24">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">New Entry</h2>
        <p className="text-sm text-slate-500">Log a new maintenance record</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Model / Asset Tag" htmlFor="computerModel">
                    <input id="computerModel" type="text" value={computerModel} onChange={e => setComputerModel(e.target.value)} required placeholder="e.g. Dell Latitude" className={inputClasses} />
                </FormField>
                <FormField label="Serial Number" htmlFor="serialNumber">
                    <input id="serialNumber" type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required placeholder="e.g. 5CG123..." className={inputClasses} />
                </FormField>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Owner / Dept" htmlFor="owner">
                    <input id="owner" type="text" value={owner} onChange={e => setOwner(e.target.value)} required placeholder="User name" className={inputClasses} />
                </FormField>
                <FormField label="IP Address" htmlFor="ipAddress">
                    <input id="ipAddress" type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="Optional" className={inputClasses} />
                </FormField>
            </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <FormField label="Reported Issue" htmlFor="reportedIssue">
                <textarea id="reportedIssue" value={reportedIssue} onChange={e => setReportedIssue(e.target.value)} required placeholder="What is the problem?" rows={2} className={inputClasses} />
            </FormField>
            <FormField label="Diagnosis" htmlFor="diagnosis">
                <textarea id="diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required placeholder="Technical analysis..." rows={2} className={inputClasses} />
            </FormField>
            <FormField label="Actions Taken" htmlFor="actionsTaken">
                <textarea id="actionsTaken" value={actionsTaken} onChange={e => setActionsTaken(e.target.value)} required placeholder="Resolution steps..." rows={2} className={inputClasses} />
            </FormField>
        </div>

        <div className="space-y-4">
            <FormField label="Status" htmlFor="status">
                <div className="relative">
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as LogStatus)} required className={`${inputClasses} appearance-none cursor-pointer`}>
                    {Object.values(LogStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </FormField>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Attachments</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                
                {!imagePreview ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => triggerFileInput(true)} className="flex flex-col items-center justify-center px-4 py-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                            <CameraIcon className="h-6 w-6 mb-1" /> 
                            <span>Take Photo</span>
                        </button>
                        <button type="button" onClick={() => triggerFileInput(false)} className="flex flex-col items-center justify-center px-4 py-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                            <UploadIcon className="h-6 w-6 mb-1" /> 
                            <span>Upload</span>
                        </button>
                    </div>
                ) : (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button type="button" onClick={clearImage} className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transform scale-90 hover:scale-100 transition shadow-lg">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          {isSubmitting ? (
             <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Record...
             </span>
          ) : 'Save Log Entry'}
        </button>
      </form>
    </div>
  );
};
