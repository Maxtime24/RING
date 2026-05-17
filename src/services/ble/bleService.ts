import { BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import {
  BLE_CHARACTERISTIC_UUIDS,
  BLE_SCAN_TIMEOUT,
  BLE_SERVICE_UUIDS,
} from '../../constants';
import { BLEDevice } from '../../types';

function normalizeDevice(device: Device): BLEDevice {
  return {
    id: device.id,
    name: device.name || 'Unknown Device',
    macAddress: device.id,
    rssi: device.rssi ?? 0,
    txPowerLevel: device.txPowerLevel ?? undefined,
    isConnectable: device.isConnectable ?? true,
  };
}

export class BleService {
  private manager: BleManager | null = null;

  private getManager(): BleManager {
    if (Platform.OS === 'web') {
      throw new Error('BLE scanning is not supported on web.');
    }
    if (!this.manager) {
      this.manager = new BleManager();
    }
    return this.manager;
  }

  async scanForDevices(): Promise<BLEDevice[]> {
    const manager = this.getManager();
    const foundDevices: Record<string, BLEDevice> = {};

    return new Promise<BLEDevice[]>((resolve, reject) => {
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          manager.startDeviceScan(
            null,
            null,
            (error, device) => {
              if (error) {
                return reject(error);
              }

              if (device && device.id) {
                foundDevices[device.id] = normalizeDevice(device);
              }
            }
          );

          timeoutHandle = setTimeout(() => {
            manager.stopDeviceScan();
            subscription.remove();
            resolve(Object.values(foundDevices));
          }, BLE_SCAN_TIMEOUT);
        }
      }, true);

      setTimeout(() => {
        if (!timeoutHandle) {
          subscription.remove();
          reject(new Error('Bluetooth adapter did not become ready.'));
        }
      }, 5000);
    });
  }

  async connectToDevice(deviceId: string): Promise<Device> {
    const manager = this.getManager();
    const device = await manager.connectToDevice(deviceId, { autoConnect: true });
    await device.discoverAllServicesAndCharacteristics();
    return device;
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    const manager = this.getManager();
    await manager.cancelDeviceConnection(deviceId);
  }

  async readHealthCharacteristic(device: Device): Promise<Characteristic | null> {
    try {
      return await device.readCharacteristicForService(
        BLE_SERVICE_UUIDS.HEALTH,
        BLE_CHARACTERISTIC_UUIDS.HEART_RATE
      );
    } catch (error) {
      return null;
    }
  }

  async monitorCharacteristic(
    device: Device,
    serviceUUID: string,
    characteristicUUID: string,
    callback: (value: string) => void
  ) {
    return device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (_error, characteristic) => {
        if (_error || !characteristic?.value) {
          return;
        }

        callback(characteristic.value);
      }
    );
  }
}

export const bleService = new BleService();
