import { useState } from 'react';
import { ClientInterface } from '../interfaces/ClientInterface';
import { DeviceInterface } from '../interfaces/DeviceInterface';

export const useCommonHooks = () => {
  const [clientDni, setClientDni] = useState('');
  const [foundClient, setFoundClient] = useState<ClientInterface | null>(null);
  const [deviceBrand, setDeviceBrand] = useState('');
  const [devices, setDevices] = useState<DeviceInterface[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInterface | null>(null);

  // Agregar los estados adicionales
  const [issueDescription, setIssueDescription] = useState('');
  const [staffId, setStaffId] = useState('');
  const [repairStatus, setRepairStatus] = useState('');

  const resetClientAndDevices = () => {
    setClientDni('');
    setFoundClient(null);
    setDeviceBrand('');
    setDevices([]);
    setSelectedDevice(null);
  };

  const resetForm = () => {
    setIssueDescription('');
    resetClientAndDevices();
    setStaffId('');
    setRepairStatus('');
  };

  return {
    clientDni,
    setClientDni,
    foundClient,
    setFoundClient,
    deviceBrand,
    setDeviceBrand,
    devices,
    setDevices,
    selectedDevice,
    setSelectedDevice,
    issueDescription,
    setIssueDescription,
    staffId,
    setStaffId,
    repairStatus,
    setRepairStatus,
    resetClientAndDevices,
    resetForm,
  };
};
