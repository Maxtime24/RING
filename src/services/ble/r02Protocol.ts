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

export enum RealTimeReading {
  HEART_RATE = 1,
  BLOOD_PRESSURE = 2,
  SPO2 = 3,
  FATIGUE = 4,
  HEALTH_CHECK = 5,
}

export enum RealTimeAction {
  START = 1,
  PAUSE = 2,
  CONTINUE = 3,
  STOP = 4,
}

export const CMD_START_REAL_TIME = 105; // 0x69
export const CMD_STOP_REAL_TIME = 106; // 0x6A

export interface R02Data {
  type: R02Command;
  value: number;
  raw?: string;
}

export class R02Protocol {
  /**
   * Calculate 8-bit checksum (sum of all bytes & 255)
   */
  static checksum(packet: Buffer): number {
    let sum = 0;
    for (let i = 0; i < 15; i++) {
      sum += packet[i];
    }
    return sum & 255;
  }

  /**
   * Create a well-formed 16-byte packet with checksum
   */
  static makePacket(command: number, subData?: number[]): Buffer {
    const packet = Buffer.alloc(16, 0);
    packet[0] = command;

    if (subData) {
      for (let i = 0; i < subData.length && i < 14; i++) {
        packet[i + 1] = subData[i];
      }
    }

    packet[15] = this.checksum(packet);
    return packet;
  }

  /**
   * Parse a 16-byte notification packet from the ring.
   */
  static parseNotification(base64Value: string): R02Data | null {
    const buffer = Buffer.from(base64Value, 'base64');
    
    if (buffer.length < 1) return null;

    const cmd = buffer[0];
    
    switch (cmd) {
      case CMD_START_REAL_TIME: {
        const kind = buffer[1];
        const errorCode = buffer[2];
        if (errorCode !== 0) return null;

        if (kind === RealTimeReading.HEART_RATE) {
          return {
            type: R02Command.HEART_RATE,
            value: buffer[3],
            raw: base64Value,
          };
        } else if (kind === RealTimeReading.SPO2) {
          return {
            type: R02Command.BLOOD_OXYGEN,
            value: buffer[3],
            raw: base64Value,
          };
        }
        return null;
      }
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
    const buffer = this.makePacket(cmd, payload);
    return buffer.toString('base64');
  }

  static getStartPacket(readingType: RealTimeReading): string {
    return this.makePacket(CMD_START_REAL_TIME, [readingType, RealTimeAction.START]).toString('base64');
  }

  static getContinuePacket(readingType: RealTimeReading): string {
    return this.makePacket(CMD_START_REAL_TIME, [readingType, RealTimeAction.CONTINUE]).toString('base64');
  }

  static getStopPacket(readingType: RealTimeReading): string {
    return this.makePacket(CMD_STOP_REAL_TIME, [readingType, 0, 0]).toString('base64');
  }
}

