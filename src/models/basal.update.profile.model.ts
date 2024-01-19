import { BaseModel } from './base.model';

export interface BasalUpdateProfileModel extends BaseModel {
  /** Rates per 1 hour. Length === 24 */
  rates: number[];

  profileNumber: number;
}
