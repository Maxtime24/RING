import { useCallback, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { bleService } from '../services/ble/bleService';
import { RealTimeReading } from '../services/ble/r02Protocol';

// Global variable to keep the schedule interval alive across re-renders and hook unmounts
let globalAutoMeasureInterval: ReturnType<typeof setInterval> | null = null;

export function useMeasurement() {
  const bleConnection = useAppStore((state: any) => state.bleConnection);
  
  const isMeasuringHR = useAppStore((state: any) => state.isMeasuringHR);
  const isMeasuringO2 = useAppStore((state: any) => state.isMeasuringO2);
  const lastHRMeasuredAt = useAppStore((state: any) => state.lastHRMeasuredAt);
  const lastO2MeasuredAt = useAppStore((state: any) => state.lastO2MeasuredAt);
  
  const setMeasuring = useAppStore((state: any) => state.setMeasuring);
  const setLastMeasuredAt = useAppStore((state: any) => state.setLastMeasuredAt);

  // Manual Measure HR (1 minute)
  const measureHeartRate = useCallback(async () => {
    const device = bleService.getConnectedDevice();
    if (!device) {
      console.warn('[useMeasurement] Cannot measure HR: No BLE device connected.');
      return;
    }
    if (isMeasuringHR) return;

    setMeasuring('hr', true);
    try {
      console.log('[useMeasurement] Starting real-time Heart Rate measurement...');
      await bleService.startRealTimeMeasurement(device, RealTimeReading.HEART_RATE);

      // Measure for 60 seconds (1 minute)
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } catch (err) {
      console.error('[useMeasurement] Error in HR measurement:', err);
    } finally {
      try {
        await bleService.stopRealTimeMeasurement(device, RealTimeReading.HEART_RATE);
      } catch (stopErr) {
        console.error('[useMeasurement] Error stopping HR measurement:', stopErr);
      }
      setMeasuring('hr', false);
      setLastMeasuredAt('hr', new Date().toISOString());
      console.log('[useMeasurement] Real-time Heart Rate measurement stopped.');
    }
  }, [isMeasuringHR, setMeasuring, setLastMeasuredAt]);

  // Manual Measure SpO2 (1 minute)
  const measureOxygen = useCallback(async () => {
    const device = bleService.getConnectedDevice();
    if (!device) {
      console.warn('[useMeasurement] Cannot measure O2: No BLE device connected.');
      return;
    }
    if (isMeasuringO2) return;

    setMeasuring('o2', true);
    try {
      console.log('[useMeasurement] Starting real-time Oxygen measurement...');
      await bleService.startRealTimeMeasurement(device, RealTimeReading.SPO2);

      // Measure for 60 seconds (1 minute)
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } catch (err) {
      console.error('[useMeasurement] Error in O2 measurement:', err);
    } finally {
      try {
        await bleService.stopRealTimeMeasurement(device, RealTimeReading.SPO2);
      } catch (stopErr) {
        console.error('[useMeasurement] Error stopping O2 measurement:', stopErr);
      }
      setMeasuring('o2', false);
      setLastMeasuredAt('o2', new Date().toISOString());
      console.log('[useMeasurement] Real-time Oxygen measurement stopped.');
    }
  }, [isMeasuringO2, setMeasuring, setLastMeasuredAt]);

  // Sequential auto measurement trigger (HR 1m -> O2 1m)
  const triggerAutoMeasurement = useCallback(async () => {
    const device = bleService.getConnectedDevice();
    if (!device) return;

    console.log('[useMeasurement] Auto schedule triggered: Starting sequence...');
    // 1. Measure HR for 1 minute
    await measureHeartRate();
    
    // Brief delay between measurements
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 2. Measure O2 for 1 minute
    await measureOxygen();
    console.log('[useMeasurement] Auto schedule sequence complete.');
  }, [measureHeartRate, measureOxygen]);

  const startAutoSchedule = useCallback(() => {
    if (globalAutoMeasureInterval) {
      clearInterval(globalAutoMeasureInterval);
    }

    console.log('[useMeasurement] Starting 1-hour auto health measurement schedule...');
    // Trigger immediately upon starting the schedule
    triggerAutoMeasurement();

    // Set interval for every 1 hour (3,600,000 ms)
    globalAutoMeasureInterval = setInterval(() => {
      triggerAutoMeasurement();
    }, 3600000);
  }, [triggerAutoMeasurement]);

  const stopAutoSchedule = useCallback(() => {
    if (globalAutoMeasureInterval) {
      clearInterval(globalAutoMeasureInterval);
      globalAutoMeasureInterval = null;
      console.log('[useMeasurement] Stopped auto health measurement schedule.');
    }
  }, []);

  // Monitor BLE connection changes to manage auto-scheduler
  useEffect(() => {
    if (bleConnection.isConnected) {
      startAutoSchedule();
    } else {
      stopAutoSchedule();
    }

    return () => {
      // Intentionally empty to keep global background timer alive as long as app runs
    };
  }, [bleConnection.isConnected, startAutoSchedule, stopAutoSchedule]);

  return {
    isMeasuringHR,
    isMeasuringO2,
    lastHRMeasuredAt,
    lastO2MeasuredAt,
    measureHeartRate,
    measureOxygen,
    startAutoSchedule,
    stopAutoSchedule,
  };
}
