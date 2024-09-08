export interface DeviceInterface {
  id: number;
  serialNumber: string;
  type:string
  brand: string;
  model: string;
  clientId: number;
  clientName: string; // Añadir esta línea
}