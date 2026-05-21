import { useCallback, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { bleService } from '../services/ble/bleService';
import useAppStore from '../store/useAppStore';

// Keep-Alive interval reference to persist across renders
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function useBle() {
  const bleConnection = useAppStore((state: any) => state.bleConnection);
  const bleDevices = useAppStore((state: any) => state.bleDevices);
  const setBleDevices = useAppStore((state: any) => state.setBleDevices);
  const setBleConnection = useAppStore((state: any) => state.setBleConnection);
  
  // Reconnect state using ref to avoid trigger loops
  const isReconnecting = useRef(false);

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

  const startKeepAlive = (device: any) => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }

    console.log('[useBle] Starting 30s Keep-Alive heartbeat to keep Colmi R02 awake...');
    keepAliveInterval = setInterval(async () => {
      try {
        const { R02Protocol, R02Command } = require('../services/ble/r02Protocol');
        // Query battery level (0x03) as keep-alive payload
        const batteryCmd = R02Protocol.createCommand(R02Command.BATTERY);
        await bleService.writeUARTCommand(device, batteryCmd);
        console.log('[useBle] Keep-Alive heartbeat sent successfully.');
      } catch (err) {
        console.error('[useBle] Failed to send Keep-Alive heartbeat:', err);
      }
    }, 30000);
  };

  const stopKeepAlive = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
      console.log('[useBle] Keep-Alive heartbeat stopped.');
    }
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

  const attemptAutoReconnect = useCallback(
    async (deviceId: string) => {
      if (isReconnecting.current) return;
      isReconnecting.current = true;
      console.log('[useBle] Auto-Reconnect activated for device:', deviceId);

      let attempts = 0;
      const maxAttempts = 5;

      const tryConnect = async () => {
        if (attempts >= maxAttempts) {
          console.log('[useBle] Auto-reconnect failed after maximum attempts.');
          isReconnecting.current = false;
          return;
        }

        attempts++;
        console.log(`[useBle] Auto-reconnect attempt ${attempts}/${maxAttempts} in 3 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        try {
          // Re-trigger connectToDevice
          await connectToDevice(deviceId);
          console.log('[useBle] Auto-reconnect successful!');
          isReconnecting.current = false;
        } catch (err) {
          console.error(`[useBle] Reconnect attempt ${attempts} failed:`, err);
          tryConnect();
        }
      };

      tryConnect();
    },
    [] // dependency on connectToDevice will be handled below implicitly
  );

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

        // Setup disconnection listener for Auto-Reconnect
        device.onDisconnected((error: any, disconnectedDevice: any) => {
          console.log('[useBle] Smart ring disconnected naturally:', disconnectedDevice?.id || deviceId, error);
          stopKeepAlive();
          setBleConnection({
            isConnected: false,
            device: null,
          });

          // Trigger Auto-Reconnect if it's not a manual disconnect
          if (!isReconnecting.current) {
            attemptAutoReconnect(deviceId);
          }
        });

        // Start periodic Keep-Alive heartbeat to maintain BLE connection
        startKeepAlive(device);

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
    [setBleConnection, attemptAutoReconnect]
  );

  const disconnectDevice = useCallback(
    async (deviceId: string) => {
      // Prevent auto-reconnect since it's a manual disconnect
      isReconnecting.current = true;
      stopKeepAlive();
      
      try {
        await bleService.disconnectDevice(deviceId);
      } finally {
        setBleConnection({
          isConnected: false,
          device: null,
        });
        isReconnecting.current = false;
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

