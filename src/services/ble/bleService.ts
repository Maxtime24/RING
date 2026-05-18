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
      this.manager = new BleManager({
        restoreStateIdentifier: 'huckBleRestoreIdentifier',
        restoreStateFunction: (restoredState) => {
          if (restoredState == null) {
            // BleManager was initialized for the first time.
            return;
          }
          // The state was restored.
        },
      });
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

  private connectedDevice: Device | null = null;

  getConnectedDevice(): Device | null {
    return this.connectedDevice;
  }

  async connectToDevice(deviceId: string): Promise<Device> {
    const manager = this.getManager();
    const device = await manager.connectToDevice(deviceId, { autoConnect: true });
    await device.discoverAllServicesAndCharacteristics();
    this.connectedDevice = device;
    return device;
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    
    this.connectedDevice = null;
    
    // Clear any active intervals for this device
    Object.keys(this.continueIntervals).forEach((key) => {
      if (key.startsWith(deviceId)) {
        clearInterval(this.continueIntervals[key]);
        delete this.continueIntervals[key];
      }
    });

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

  // Record active intervals to keep sending CONTINUE commands
  private continueIntervals: Record<string, ReturnType<typeof setInterval>> = {};

  async writeUARTCommand(device: Device, base64Value: string): Promise<Characteristic> {
    return await device.writeCharacteristicWithoutResponseForService(
      BLE_SERVICE_UUIDS.UART,
      BLE_CHARACTERISTIC_UUIDS.UART_RX,
      base64Value
    );
  }

  async startRealTimeMeasurement(device: Device, readingType: number): Promise<void> {
    const { R02Protocol } = require('./r02Protocol');
    const startPacket = R02Protocol.getStartPacket(readingType);
    
    // Send START command
    await this.writeUARTCommand(device, startPacket);

    const intervalKey = `${device.id}-${readingType}`;
    if (this.continueIntervals[intervalKey]) {
      clearInterval(this.continueIntervals[intervalKey]);
    }

    // Send CONTINUE command every 2 seconds to maintain active measurement
    this.continueIntervals[intervalKey] = setInterval(async () => {
      try {
        const continuePacket = R02Protocol.getContinuePacket(readingType);
        await this.writeUARTCommand(device, continuePacket);
      } catch (err) {
        console.error(`[BleService] Failed to send continue packet for type ${readingType}:`, err);
      }
    }, 2000);
  }

  async stopRealTimeMeasurement(device: Device, readingType: number): Promise<void> {
    const { R02Protocol } = require('./r02Protocol');
    const stopPacket = R02Protocol.getStopPacket(readingType);

    const intervalKey = `${device.id}-${readingType}`;
    if (this.continueIntervals[intervalKey]) {
      clearInterval(this.continueIntervals[intervalKey]);
      delete this.continueIntervals[intervalKey];
    }

    // Send STOP command
    await this.writeUARTCommand(device, stopPacket);
  }
}

export const bleService = new BleService();

