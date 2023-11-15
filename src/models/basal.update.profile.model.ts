export interface BasalUpdateProfileModel {
  /** Rates per 30 min. Length === 24 */
  rates: number[];

  profileNumber: number;

  activateThisProfile: boolean;
}
