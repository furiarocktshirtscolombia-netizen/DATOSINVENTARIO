
import React, { useState, useEffect } from 'react';
import { FileRecord, FileType, ProcessStatus } from './types';
import FileUploader from './components/FileUploader';
import HistoryTable from './components/HistoryTable';

const STORAGE_KEY = 'inventory_repo_records';

const App: React.FC = () => {
  const [records, setRecords] = useState<FileRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load initial records
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      // Mock initial data if empty
      const initial: FileRecord[] = [
        {
          id: '1',
          fechaCarga: new Date().toISOString(),
          mes: '2024-01',
          sede: 'Sede Norte',
          tipoArchivo: FileType.INVENTARIOS,
          nombreArchivo: 'inv_norte_enero.xlsx',
          idDrive: 'drive_abc_123',
          idSheet: 'sheet_xyz_789',
          estado: ProcessStatus.COMPLETED
        }
      ];
      setRecords(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const handleUpload = async (newRecord: Omit<FileRecord, 'id' | 'idDrive' | 'idSheet' | 'estado' | 'fechaCarga'>) => {
    setIsProcessing(true);
    
    // Create a temporary record with "Uploading" state
    const tempId = Math.random().toString(36).substr(2, 9);
    const initialRecord: FileRecord = {
      ...newRecord,
      id: tempId,
      fechaCarga: new Date().toISOString(),
      idDrive: 'pending...',
      idSheet: 'pending...',
      estado: ProcessStatus.UPLOADING
    };

    setRecords(prev => [initialRecord, ...prev]);

    // Simulate Backend Process (Drive Upload -> Sheet Conversion -> Consolidation)
    try {
      // Phase 1: Upload
      await new Promise(r => setTimeout(r, 1500));
      setRecords(prev => prev.map(r => r.id === tempId ? { ...r, estado: ProcessStatus.CONVERTING, idDrive: `drive_${Math.random().toString(36).substr(2, 8)}` } : r));
      
      // Phase 2: Conversion
      await new Promise(r => setTimeout(r, 1500));
      const finalRecord: FileRecord = {
        ...initialRecord,
        idDrive: `drive_${Math.random().toString(36).substr(2, 8)}`,
        idSheet: `sheet_${Math.random().toString(36).substr(2, 8)}`,
        estado: ProcessStatus.COMPLETED
      };

      setRecords(prev => {
        const updated = prev.map(r => r.id === tempId ? finalRecord : r);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setRecords(prev => prev.map(r => r.id === tempId ? { ...r, estado: ProcessStatus.ERROR } : r));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Repositorio de Inventarios</h1>
              <p className="text-xs text-slate-400">Sistema Centralizado de Archivos RAW</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Versión 1.0.4 - Operativo
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload Form */}
        <section className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Nueva Carga de Archivo
              </h2>
            </div>
            <div className="p-5">
              <FileUploader onUpload={handleUpload} isProcessing={isProcessing} />
            </div>
          </div>
        </section>

        {/* Right Column: History Table */}
        <section className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-grow">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                CONTROL_ARCHIVOS (Historial)
              </h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {records.length} registros
              </span>
            </div>
            <div className="overflow-x-auto">
              <HistoryTable records={records} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Sistema de Gestión de Inventarios - Automatización mediante Google Studio AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
