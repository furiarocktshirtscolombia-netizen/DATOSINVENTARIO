
import React, { useState } from 'react';
import { FileType, FileRecord, ProcessStatus } from '../types';
import { validateFileMetadata } from '../services/geminiService';

interface FileUploaderProps {
  onUpload: (record: Omit<FileRecord, 'id' | 'idDrive' | 'idSheet' | 'estado' | 'fechaCarga'>) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, isProcessing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [sede, setSede] = useState('');
  const [tipo, setTipo] = useState<FileType>(FileType.INVENTARIOS);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !sede) return;

    // Simulate AI validation before actual upload
    const analysis = await validateFileMetadata(file.name, tipo);
    setAiAnalysis(analysis || null);

    onUpload({
      mes,
      sede,
      tipoArchivo: tipo,
      nombreArchivo: file.name,
    });

    // Reset local state after a short delay
    setTimeout(() => {
      setFile(null);
      setSede('');
      setAiAnalysis(null);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Archivo Excel (.xlsx, .xls)</label>
        <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}`}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          <div className="text-center">
            {file ? (
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-blue-700 truncate w-full">{file.name}</p>
                <p className="text-xs text-blue-500 mt-1">Archivo seleccionado</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-500 font-medium">Haz clic o arrastra un archivo</p>
                <p className="text-xs text-slate-400 mt-1">Formatos permitidos: .xlsx, .xls</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mes Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Mes del Reporte (YYYY-MM)</label>
        <input
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          required
        />
      </div>

      {/* Sede Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Sede / Ubicación</label>
        <input
          type="text"
          placeholder="Ej: Sede Norte, Planta A..."
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          required
        />
      </div>

      {/* Tipo Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Archivo</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(FileType).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                tipo === t
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {aiAnalysis && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg animate-fade-in">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Sugerencia AI
          </p>
          <p className="text-xs text-indigo-700 italic">"{aiAnalysis}"</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !file || !sede}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
          isProcessing || !file || !sede
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Procesando...</span>
          </>
        ) : (
          <span>Iniciar Carga y Procesamiento</span>
        )}
      </button>

      <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
        Organización Automática en Drive & Sheets
      </p>
    </form>
  );
};

export default FileUploader;
