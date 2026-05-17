import { useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { bleService } from '../services/ble/bleService';
import useAppStore from '../store/useAppStore';

export function useBle() {
  const bleConnection = useAppStore((state: any) => state.bleConnection);
  const bleDevices = useAppStore((state: any) => state.bleDevices);
  const setBleDevices = useAppStore((state: any) => state.setBleDevices);
  const setBleConnection = useAppStore((state: any) => state.setBleConnection);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles this via Info.plist
  };

  const scanDevices = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setBleConnection({ error: '블루투스 권한이 필요합니다.' });
      return [];
    }

    setBleConnection({ isScanning: true, error: null });

    try {
      const devices = await bleService.scanForDevices();
      setBleDevices(devices);
      return devices;
    } catch (error) {
      setBleConnection({ error: String(error) });
      return [];
    } finally {
      setBleConnection({ isScanning: false });
    }
  }, [setBleDevices, setBleConnection]);

  const connectToDevice = useCallback(
    async (deviceId: string) => {
      setBleConnection({ isConnecting: true, error: null });

      try {
        const device = await bleService.connectToDevice(deviceId);
        
        // Start monitoring UART TX for R02 data
        const { BLE_SERVICE_UUIDS, BLE_CHARACTERISTIC_UUIDS } = require('../constants');
        const { R02Protocol } = require('../services/ble/r02Protocol');
        
        bleService.monitorCharacteristic(
          device,
          BLE_SERVICE_UUIDS.UART,
          BLE_CHARACTERISTIC_UUIDS.UART_TX,
          (base64Value) => {
            const data = R02Protocol.parseNotification(base64Value);
            if (data) {
              // Update store with real data
              const store = require('../store/useAppStore').default.getState();
              switch (data.type) {
                case 0x01: // HR
                  store.setHeartRate(data.value);
                  break;
                case 0x02: // O2
                  store.setOxygenLevel(data.value);
                  break;
                case 0x04: // Steps
                  store.setSteps(data.value);
                  break;
              }
            }
          }
        );

        setBleConnection({
          isConnected: true,
          device: {
            id: device.id,
            name: device.name || 'Smart Ring',
            macAddress: device.id,
            rssi: device.rssi ?? 0,
            txPowerLevel: device.txPowerLevel ?? undefined,
            isConnectable: device.isConnectable ?? true,
          },
        });
        return device;
      } catch (error) {
        setBleConnection({ error: String(error) });
        throw error;
      } finally {
        setBleConnection({ isConnecting: false });
      }
    },
    [setBleConnection]
  );

  const disconnectDevice = useCallback(
    async (deviceId: string) => {
      try {
        await bleService.disconnectDevice(deviceId);
      } finally {
        setBleConnection({
          isConnected: false,
          device: null,
        });
      }
    },
    [setBleConnection]
  );

  return {
    bleConnection,
    bleDevices,
    scanDevices,
    connectToDevice,
    disconnectDevice,
  };
}
