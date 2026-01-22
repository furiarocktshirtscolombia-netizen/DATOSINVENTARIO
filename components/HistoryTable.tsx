
import React from 'react';
import { FileRecord, ProcessStatus, FileType } from '../types';

interface HistoryTableProps {
  records: FileRecord[];
}

const StatusBadge: React.FC<{ status: ProcessStatus }> = ({ status }) => {
  const styles = {
    [ProcessStatus.PENDING]: 'bg-slate-100 text-slate-600 border-slate-200',
    [ProcessStatus.UPLOADING]: 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse',
    [ProcessStatus.CONVERTING]: 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse',
    [ProcessStatus.COMPLETED]: 'bg-green-50 text-green-700 border-green-200',
    [ProcessStatus.ERROR]: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

const TypeBadge: React.FC<{ type: FileType }> = ({ type }) => {
  const styles = {
    [FileType.INVENTARIOS]: 'bg-emerald-50 text-emerald-700',
    [FileType.COMPRAS]: 'bg-amber-50 text-amber-700',
    [FileType.VENTAS]: 'bg-rose-50 text-rose-700',
  };

  return (
    <span className={`text-[11px] font-semibold px-2 py-1 rounded ${styles[type]}`}>
      {type}
    </span>
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No se han encontrado registros de carga.</p>
        <p className="text-slate-400 text-sm mt-1">Usa el formulario lateral para subir tu primer archivo.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha Carga</th>
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mes / Sede</th>
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Archivo Original</th>
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enlaces</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {records.map((record) => (
          <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-5 py-4 whitespace-nowrap">
              <div className="text-sm text-slate-600 font-medium">
                {new Date(record.fechaCarga).toLocaleDateString()}
              </div>
              <div className="text-[10px] text-slate-400">
                {new Date(record.fechaCarga).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </td>
            <td className="px-5 py-4">
              <div className="text-sm font-bold text-slate-700">{record.mes}</div>
              <div className="text-xs text-slate-500">{record.sede}</div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
              <TypeBadge type={record.tipoArchivo} />
            </td>
            <td className="px-5 py-4 max-w-[180px]">
              <div className="text-xs font-medium text-slate-600 truncate" title={record.nombreArchivo}>
                {record.nombreArchivo}
              </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
              <StatusBadge status={record.estado} />
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
              {record.estado === ProcessStatus.COMPLETED ? (
                <div className="flex space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`https://drive.google.com/open?id=${record.idDrive}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    title="Ver en Drive"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10.14,7.11,14.34,14.4h-8.4L1.74,7.11Zm10.73,7.29H12.48l2.1-3.63L22.2,3.6,24,6.71ZM15.47,2.4,19.67,9.69,15.47,16.98,11.27,9.69Z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${record.idSheet}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                    title="Ver Sheet Generado"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,3H5C3.89,3,3,3.89,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.89,20.1,3,19,3z M19,19H5V5h14V19z M7,8h10v2H7V8z M7,12h10v2H7V12z M7,16h7v2H7V16z"/>
                    </svg>
                  </a>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 italic">Procesando...</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
