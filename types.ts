
export enum FileType {
  INVENTARIOS = 'Inventarios',
  COMPRAS = 'Compras',
  VENTAS = 'Ventas'
}

export enum ProcessStatus {
  PENDING = 'Pendiente',
  UPLOADING = 'Subiendo...',
  CONVERTING = 'Convirtiendo...',
  COMPLETED = 'Completado',
  ERROR = 'Error'
}

export interface FileRecord {
  id: string;
  fechaCarga: string;
  mes: string;
  sede: string;
  tipoArchivo: FileType;
  nombreArchivo: string;
  idDrive: string;
  idSheet: string;
  estado: ProcessStatus;
}
