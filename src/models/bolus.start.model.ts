import { BolusSpeed } from '../packets/dana.packet.bolus.start';
import { BaseModel } from './base.model';

export interface BolusStartModel extends BaseModel {
  amount: number;

  /** Default: 12 E/min */
  speed?: BolusSpeed;
}
