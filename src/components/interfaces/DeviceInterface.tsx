export interface DeviceInterface {
    id: number;
    serialNumber: string;
    brand: string;
    model: string;
    clientId: number;
    clientDni?: string;
    clientFullName?: string;
  }