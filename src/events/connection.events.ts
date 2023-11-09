export const ConnectionEvents = {
  FailedSecuring: -2,
  FailedConnecting: -1,

  Idle: 0,
  DeviceFound: 1,
  Securing: 2,
  Connected: 3,
} as const;
