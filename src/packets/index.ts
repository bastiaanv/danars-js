import { CommandBasalCancelTemporary, parsePacketBasalCancelTemporary } from './dana.packet.basal.cancel.temporary';
import { CommandBasalGetProfileNumber, parsePacketBasalGetProfileNumber } from './dana.packet.basal.get.profile.number';
import { CommandBasalGetRate, parsePacketBasalGetRate } from './dana.packet.basal.get.rate';
import { CommandBasalSetProfileNumber, parsePacketBasalSetProfileNumber } from './dana.packet.basal.set.profile.number';
import { CommandBasalSetProfileRate, parsePacketBasalSetProfileRate } from './dana.packet.basal.set.profile.rate';
import { CommandBasalSetSuspendOff, parsePacketBasalSetSuspendOff } from './dana.packet.basal.set.suspend.off';
import { CommandBasalSetSuspendOn, parsePacketBasalSetSuspendOn } from './dana.packet.basal.set.suspend.on';
import { CommandBasalSetTemporary, parsePacketBasalSetTemporary } from './dana.packet.basal.set.temporary';
import { OP_CODE_INDEX, TYPE_INDEX } from './dana.packet.base';
import { CommandBolusCancelExtended, parsePacketBolusCancelExtended } from './dana.packet.bolus.cancel.extended';
import { CommandBolusGet24CIRCFArray, parsePacketBolusGet24CIRCFArray } from './dana.packet.bolus.get.24.circf.array';
import { CommandBolusGetCalculationInformation, parsePacketBolusGetCalculationInformation } from './dana.packet.bolus.get.calculation.information';
import { CommandBolusGetCIRCFArray, parsePacketBolusGetCIRCFArray } from './dana.packet.bolus.get.circf.array';
import { CommandBolusGetOption, parsePacketBolusGetOption } from './dana.packet.bolus.get.option';
import { CommandBolusGetStepInformation, parsePacketBolusGetStepInformation } from './dana.packet.bolus.get.step.option.information';
import { CommandBolusSet24CIRCFArray, parsePacketBolusSet24CIRCFArray } from './dana.packet.bolus.set.24.circf.array';
import { CommandBolusSetExtended, parsePacketBolusSetExtended } from './dana.packet.bolus.set.extended';
import { CommandBolusSetOption, parsePacketBolusSetOption } from './dana.packet.bolus.set.option';
import { CommandBolusStart, parsePacketBolusStart } from './dana.packet.bolus.start';
import { CommandBolusStop, parsePacketBolusStop } from './dana.packet.bolus.stop';
import { CommandGeneralAvgBolus, parsePacketGeneralAvgBolus } from './dana.packet.general.avg.bolus';
import { CommandGeneralClearUserTimeChangeFlag, parsePacketGeneralClearUserTimeChangeFlag } from './dana.packet.general.clear.user.time.change.flag';
import { CommandGeneralGetInitialScreenInformation, parsePacketGeneralGetInitialScreenInformation } from './dana.packet.general.get.initial.screen.information';
import { CommandGeneralGetPumpCheck, parsePacketGeneralGetPumpCheck } from './dana.packet.general.get.pump.check';
import { CommandGeneralGetPumpDecRatio, parsePacketGeneralGetPumpDecRatio } from './dana.packet.general.get.pump.dec.ratio';
import { CommandGeneralGetPumpTime, parsePacketGeneralGetPumpTime } from './dana.packet.general.get.pump.time';
import { CommandGeneralGetPumpTimeUtcWithTimezone, parsePacketGeneralGetPumpTimeUtcWithTimezone } from './dana.packet.general.get.pump.time.utc.with.timezone';
import { CommandGeneralGetShippingInformation, parsePacketGeneralGetShippingInformation } from './dana.packet.general.get.shipping.information';
import { CommandGeneralGetShippingVersion, parsePacketGeneralGetShippingVersion } from './dana.packet.general.get.shipping.version';
import { CommandGeneralGetUserOption, parsePacketGeneralGetUserOption } from './dana.packet.general.get.user.option';
import { CommandGeneralGetUserTimeChangeFlag, parsePacketGeneralGetUserTimeChangeFlag } from './dana.packet.general.get.user.time.change.flag';
import { CommandGeneralKeepConnection, parsePacketGeneralKeepConnection } from './dana.packet.general.keep.connection';
import { CommandGeneralSaveHistory, parsePacketGeneralSaveHistory } from './dana.packet.general.save.history';
import { CommandGeneralSetHistoryUploadMode, parsePacketGeneralSetHistoryUploadMode } from './dana.packet.general.set.history.upload.mode';
import { CommandGeneralSetPumpTime, parsePacketGeneralSetPumpTime } from './dana.packet.general.set.pump.time';
import { CommandGeneralSetPumpTimeUtcWithTimezone, parsePacketGeneralSetPumpTimeUtcWithTimezone } from './dana.packet.general.set.pump.time.utc.with.timezone';
import { CommandGeneralSetUserOption, parsePacketGeneralSetUserOption } from './dana.packet.general.set.user.option';
import { CommandHistoryAlarm } from './dana.packet.history.alarm';
import { CommandHistoryAll } from './dana.packet.history.all';
import { CommandHistoryBasal } from './dana.packet.history.basal';
import { parsePacketHistory } from './dana.packet.history.base';
import { CommandHistoryBloodGlucose } from './dana.packet.history.blood.glucose';
import { CommandHistoryBolus } from './dana.packet.history.bolus';
import { CommandHistoryCarbohydrates } from './dana.packet.history.carbohydrates';
import { CommandHistoryDaily } from './dana.packet.history.daily';
import { CommandHistoryPrime } from './dana.packet.history.prime';
import { CommandHistoryRefill } from './dana.packet.history.refill';
import { CommandHistorySuspend } from './dana.packet.history.suspend';
import { CommandHistoryTemporary } from './dana.packet.history.temporary';
import { CommandLoopHistoryEvents, parsePacketLoopHistoryEvents } from './dana.packet.loop.history.events';
import { CommandLoopSetEventHistory, parsePacketLoopSetEventHistory } from './dana.packet.loop.set.event.history';
import { CommandLoopSetTemporaryBasal, parsePacketLoopSetTemporaryBasal } from './dana.packet.loop.set.temporary.basal';
import { CommandNotifyAlarm, parsePacketNotifyAlarm } from './dana.packet.notify';
import { CommandNotifyDeliveryComplete, parsePacketNotifyDeliveryComplete } from './dana.packet.notify.delivery.complete';
import { CommandNotifyDeliveryRateDisplay, parsePacketNotifyDeliveryRateDisplay } from './dana.packet.notify.delivery.rate.display';
import { CommandNotifyMissedBolus, parsePacketNotifyMissedBolus } from './dana.packet.notify.missed.bolus';

export function parseMessage(data: Uint8Array) {
  const receivedCommand = ((data[TYPE_INDEX] & 0xff) << 8) + (data[OP_CODE_INDEX] & 0xff);

  const parser = findMessageParser[receivedCommand];
  if (!parser) {
    return null;
  }

  return { ...parser(data), command: receivedCommand };
}

const findMessageParser = {
  [CommandBasalCancelTemporary]: parsePacketBasalCancelTemporary,
  [CommandBasalGetProfileNumber]: parsePacketBasalGetProfileNumber,
  [CommandBasalGetRate]: parsePacketBasalGetRate,
  [CommandBasalSetProfileRate]: parsePacketBasalSetProfileRate,
  [CommandBasalSetProfileNumber]: parsePacketBasalSetProfileNumber,
  [CommandBasalSetSuspendOff]: parsePacketBasalSetSuspendOff,
  [CommandBasalSetSuspendOn]: parsePacketBasalSetSuspendOn,
  [CommandBasalSetTemporary]: parsePacketBasalSetTemporary,
  [CommandBolusCancelExtended]: parsePacketBolusCancelExtended,
  [CommandBolusGet24CIRCFArray]: parsePacketBolusGet24CIRCFArray,
  [CommandBolusGetCIRCFArray]: parsePacketBolusGetCIRCFArray,
  [CommandBolusGetCalculationInformation]: parsePacketBolusGetCalculationInformation,
  [CommandBolusGetOption]: parsePacketBolusGetOption,
  [CommandBolusGetStepInformation]: parsePacketBolusGetStepInformation,
  [CommandBolusSet24CIRCFArray]: parsePacketBolusSet24CIRCFArray,
  [CommandBolusSetExtended]: parsePacketBolusSetExtended,
  [CommandBolusSetOption]: parsePacketBolusSetOption,
  [CommandBolusStart]: parsePacketBolusStart,
  [CommandBolusStop]: parsePacketBolusStop,
  [CommandGeneralAvgBolus]: parsePacketGeneralAvgBolus,
  [CommandGeneralClearUserTimeChangeFlag]: parsePacketGeneralClearUserTimeChangeFlag,
  [CommandGeneralGetInitialScreenInformation]: parsePacketGeneralGetInitialScreenInformation,
  [CommandGeneralGetPumpCheck]: parsePacketGeneralGetPumpCheck,
  [CommandGeneralGetPumpDecRatio]: parsePacketGeneralGetPumpDecRatio,
  [CommandGeneralGetPumpTime]: parsePacketGeneralGetPumpTime,
  [CommandGeneralGetPumpTimeUtcWithTimezone]: parsePacketGeneralGetPumpTimeUtcWithTimezone,
  [CommandGeneralGetShippingInformation]: parsePacketGeneralGetShippingInformation,
  [CommandGeneralGetShippingVersion]: parsePacketGeneralGetShippingVersion,
  [CommandGeneralGetUserOption]: parsePacketGeneralGetUserOption,
  [CommandGeneralGetUserTimeChangeFlag]: parsePacketGeneralGetUserTimeChangeFlag,
  [CommandGeneralKeepConnection]: parsePacketGeneralKeepConnection,
  [CommandGeneralSaveHistory]: parsePacketGeneralSaveHistory,
  [CommandGeneralSetHistoryUploadMode]: parsePacketGeneralSetHistoryUploadMode,
  [CommandGeneralSetPumpTime]: parsePacketGeneralSetPumpTime,
  [CommandGeneralSetPumpTimeUtcWithTimezone]: parsePacketGeneralSetPumpTimeUtcWithTimezone,
  [CommandGeneralSetUserOption]: parsePacketGeneralSetUserOption,
  [CommandHistoryAlarm]: parsePacketHistory,
  [CommandHistoryAll]: parsePacketHistory,
  [CommandHistoryBasal]: parsePacketHistory,
  [CommandHistoryBloodGlucose]: parsePacketHistory,
  [CommandHistoryBolus]: parsePacketHistory,
  [CommandHistoryCarbohydrates]: parsePacketHistory,
  [CommandHistoryDaily]: parsePacketHistory,
  [CommandHistoryPrime]: parsePacketHistory,
  [CommandHistoryRefill]: parsePacketHistory,
  [CommandHistorySuspend]: parsePacketHistory,
  [CommandHistoryTemporary]: parsePacketHistory,
  [CommandLoopHistoryEvents]: parsePacketLoopHistoryEvents,
  [CommandLoopSetEventHistory]: parsePacketLoopSetEventHistory,
  [CommandLoopSetTemporaryBasal]: parsePacketLoopSetTemporaryBasal,
  [CommandNotifyAlarm]: parsePacketNotifyAlarm,
  [CommandNotifyDeliveryComplete]: parsePacketNotifyDeliveryComplete,
  [CommandNotifyDeliveryRateDisplay]: parsePacketNotifyDeliveryRateDisplay,
  [CommandNotifyMissedBolus]: parsePacketNotifyMissedBolus,
} as const;
