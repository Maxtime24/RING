/**
 * Sleep Regulation Models (Two-Process Model)
 * Process S: Homeostatic sleep pressure
 * Process C: Circadian rhythm
 */

export interface SleepModelConfig {
  sMax: number;        // Maximum sleep pressure
  tau: number;         // Time constant for sleep pressure increase
  amplitude: number;   // Amplitude of circadian oscillation
  phi: number;         // Phase shift of circadian oscillation (peak time)
}

export const DEFAULT_CONFIG: SleepModelConfig = {
  sMax: 100,
  tau: 18.2,           // Standard value (hours)
  amplitude: 15,
  phi: 15.5,           // Peak around 3:30 PM
};

/**
 * Calculate Sleep Pressure S(t)
 * S(t) = Smax * (1 - e^(-t / tau))
 * @param t Time awake in hours
 * @param config Model configuration
 */
export function calculateSleepPressure(t: number, config = DEFAULT_CONFIG): number {
  return config.sMax * (1 - Math.exp(-t / config.tau));
}

/**
 * Calculate Circadian Rhythm C(t)
 * C(t) = A * sin((2 * PI / 24) * (t - phi))
 * @param t Hour of the day (0-24)
 * @param config Model configuration
 */
export function calculateCircadianRhythm(t: number, config = DEFAULT_CONFIG): number {
  return config.amplitude * Math.sin(((2 * Math.PI) / 24) * (t - config.phi));
}

/**
 * Calculate Combined Alertness Level
 * Alertness = Base + C(t) - S(t)
 */
export function calculateAlertness(
  timeOfDay: number,
  hoursAwake: number,
  config = DEFAULT_CONFIG
): number {
  const S = calculateSleepPressure(hoursAwake, config);
  const C = calculateCircadianRhythm(timeOfDay, config);
  
  // Normalize alertness to 0-100 scale
  // Base level starts high and decreases as sleep pressure builds
  const baseAlertness = 100;
  let alertness = baseAlertness - S + C;
  
  return Math.max(0, Math.min(100, alertness));
}

/**
 * Generate a 24-hour forecast for Sleep Pressure and Circadian Rhythm
 */
export function generateSleepForecast(
  wakeUpHour: number,
  currentHour: number,
  config = DEFAULT_CONFIG
) {
  const forecast = [];
  
  for (let i = 0; i < 24; i++) {
    const hourOfDay = (currentHour + i) % 24;
    const hoursAwake = (hourOfDay >= wakeUpHour) 
      ? hourOfDay - wakeUpHour 
      : (24 - wakeUpHour) + hourOfDay;
    
    forecast.push({
      hour: hourOfDay,
      s: calculateSleepPressure(hoursAwake, config),
      c: calculateCircadianRhythm(hourOfDay, config),
      alertness: calculateAlertness(hourOfDay, hoursAwake, config),
    });
  }
  
  return forecast;
}
