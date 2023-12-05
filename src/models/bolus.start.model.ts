import { BolusSpeed } from '../packets/dana.packet.bolus.start';

export interface BolusStartModel {
  amount: number;

  /** Default: 12 E/min */
  speed?: BolusSpeed;
}
