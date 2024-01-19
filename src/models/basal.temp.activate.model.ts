import { BaseModel } from './base.model';

export interface BasalTempActivateModel extends BaseModel {
  percent: number;

  /** Only whole hours are accepted */
  durationInHours: number;
}
