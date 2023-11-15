export const ConnectionEvents = {
  WrongPassword: -5,
  PumpCheckError: -4,
  FailedSecuring: -3,
  FailedConnecting: -2,
  Disconnected: -1,

  Idle: 0,
  DeviceFound: 1,
  Securing: 2,
  Connected: 3,

  RequestingPairingKeys: 10,
} as const;
