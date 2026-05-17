import { Buffer } from 'buffer';

/**
 * Colmi R02 Smart Ring Protocol
 * Based on reverse-engineered community docs.
 */

export enum R02Command {
  HEART_RATE = 0x01,
  BLOOD_OXYGEN = 0x02,
  BATTERY = 0x03,
  STEPS = 0x04,
  SYNC_TIME = 0x05,
}

export interface R02Data {
  type: R02Command;
  value: number;
  raw?: string;
}

export class R02Protocol {
  /**
   * Parse a 16-byte notification packet from the ring.
   */
  static parseNotification(base64Value: string): R02Data | null {
    const buffer = Buffer.from(base64Value, 'base64');
    
    if (buffer.length < 1) return null;

    const cmd = buffer[0];
    
    switch (cmd) {
      case R02Command.HEART_RATE:
        return {
          type: R02Command.HEART_RATE,
          value: buffer[1], // BPM is usually at byte 1
          raw: base64Value,
        };
      case R02Command.BLOOD_OXYGEN:
        return {
          type: R02Command.BLOOD_OXYGEN,
          value: buffer[1], // SpO2 % is usually at byte 1
          raw: base64Value,
        };
      case R02Command.BATTERY:
        return {
          type: R02Command.BATTERY,
          value: buffer[1], // Battery %
          raw: base64Value,
        };
      case R02Command.STEPS:
        // Steps usually occupy multiple bytes (Big Endian)
        const steps = buffer.readUInt32BE(1);
        return {
          type: R02Command.STEPS,
          value: steps,
          raw: base64Value,
        };
      default:
        return null;
    }
  }

  /**
   * Create a command packet to send to the ring.
   */
  static createCommand(cmd: R02Command, payload: number[] = []): string {
    const buffer = Buffer.alloc(16, 0);
    buffer[0] = cmd;
    for (let i = 0; i < payload.length && i < 15; i++) {
      buffer[i + 1] = payload[i];
    }
    return buffer.toString('base64');
  }
}
