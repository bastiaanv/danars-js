import { generatePacketBasalCancelTemporary } from '../../src/packets/dana.packet.basal.cancel.temporary';
import { generatePacketBasalGetProfileNumber } from '../../src/packets/dana.packet.basal.get.profile.number';
import { generatePacketBasalGetRate } from '../../src/packets/dana.packet.basal.get.rate';
import { generatePacketBasalSetProfileNumber } from '../../src/packets/dana.packet.basal.set.profile.number';
import { generatePacketBasalSetProfileRate } from '../../src/packets/dana.packet.basal.set.profile.rate';
import { generatePacketBasalSetSuspendOff } from '../../src/packets/dana.packet.basal.set.suspend.off';
import { generatePacketBasalSetSuspendOn } from '../../src/packets/dana.packet.basal.set.suspend.on';
import { generatePacketBasalSetTemporary } from '../../src/packets/dana.packet.basal.set.temporary';
import { generatePacketBolusCancelExtended } from '../../src/packets/dana.packet.bolus.cancel.extended';
import { generatePacketBolusGet24CIRCFArray } from '../../src/packets/dana.packet.bolus.get.24.circf.array';
import { generatePacketBolusGetCalculationInformation } from '../../src/packets/dana.packet.bolus.get.calculation.information';
import { generatePacketBolusGetCIRCFArray } from '../../src/packets/dana.packet.bolus.get.circf.array';
import { generatePacketBolusGetOption } from '../../src/packets/dana.packet.bolus.get.option';
import { generatePacketBolusGetStepInformation } from '../../src/packets/dana.packet.bolus.get.step.option.information';
import { generatePacketBolusSet24CIRCFArray } from '../../src/packets/dana.packet.bolus.set.24.circf.array';
import { generatePacketBolusSetExtended } from '../../src/packets/dana.packet.bolus.set.extended';
import { generatePacketBolusSetOption } from '../../src/packets/dana.packet.bolus.set.option';
import { generatePacketBolusStart } from '../../src/packets/dana.packet.bolus.start';
import { generatePacketBolusStop } from '../../src/packets/dana.packet.bolus.stop';
import { generatePacketGeneralAvgBolus } from '../../src/packets/dana.packet.general.avg.bolus';
import { generatePacketGeneralClearUserTimeChangeFlag } from '../../src/packets/dana.packet.general.clear.user.time.change.flag';
import { generatePacketGeneralGetInitialScreenInformation } from '../../src/packets/dana.packet.general.get.initial.screen.information';
import { generatePacketGeneralGetPumpCheck } from '../../src/packets/dana.packet.general.get.pump.check';
import { generatePacketGeneralGetPumpDecRatio } from '../../src/packets/dana.packet.general.get.pump.dec.ratio';
import { generatePacketGeneralGetPumpTime } from '../../src/packets/dana.packet.general.get.pump.time';
import { generatePacketGeneralGetPumpTimeUtcWithTimezone } from '../../src/packets/dana.packet.general.get.pump.time.utc.with.timezone';
import { generatePacketGeneralGetShippingInformation } from '../../src/packets/dana.packet.general.get.shipping.information';
import { generatePacketGeneralGetShippingVersion } from '../../src/packets/dana.packet.general.get.shipping.version';
import { generatePacketGeneralGetUserOption } from '../../src/packets/dana.packet.general.get.user.option';
import { generatePacketGeneralGetUserTimeChangeFlag } from '../../src/packets/dana.packet.general.get.user.time.change.flag';
import { generatePacketGeneralKeepConnection } from '../../src/packets/dana.packet.general.keep.connection';
import { generatePacketGeneralSaveHistory } from '../../src/packets/dana.packet.general.save.history';
import { generatePacketGeneralSetHistoryUploadMode } from '../../src/packets/dana.packet.general.set.history.upload.mode';
import { generatePacketGeneralSetPumpTime } from '../../src/packets/dana.packet.general.set.pump.time';
import { generatePacketGeneralSetPumpTimeUtcWithTimezone } from '../../src/packets/dana.packet.general.set.pump.time.utc.with.timezone';
import { generatePacketGeneralSetUserOption } from '../../src/packets/dana.packet.general.set.user.option';
import { generatePacketHistoryAlarm } from '../../src/packets/dana.packet.history.alarm';
import { generatePacketHistoryAll } from '../../src/packets/dana.packet.history.all';
import { generatePacketHistoryBasal } from '../../src/packets/dana.packet.history.basal';
import { generatePacketHistoryBloodGlucose } from '../../src/packets/dana.packet.history.blood.glucose';
import { generatePacketHistoryBolus } from '../../src/packets/dana.packet.history.bolus';
import { generatePacketHistoryCarbohydrates } from '../../src/packets/dana.packet.history.carbohydrates';
import { generatePacketHistoryDaily } from '../../src/packets/dana.packet.history.daily';
import { generatePacketHistoryPrime } from '../../src/packets/dana.packet.history.prime';
import { generatePacketHistoryRefill } from '../../src/packets/dana.packet.history.refill';
import { generatePacketHistorySuspend } from '../../src/packets/dana.packet.history.suspend';
import { generatePacketHistoryTemporary } from '../../src/packets/dana.packet.history.temporary';
import { generatePacketLoopHistoryEvents } from '../../src/packets/dana.packet.loop.history.events';
import { generatePacketLoopSetEventHistory } from '../../src/packets/dana.packet.loop.set.event.history';
import { generatePacketLoopSetTemporaryBasal } from '../../src/packets/dana.packet.loop.set.temporary.basal';
import { LoopHistoryEvents } from '../../src/packets/dana.type.loop.history.events.enum';

describe('Generate packet tests (snapshot way)', () => {
  it('Should generate basalCancelTemp', () => {
    const packet = generatePacketBasalCancelTemporary();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalGetProfileNumber', () => {
    const packet = generatePacketBasalGetProfileNumber();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalGetRate', () => {
    const packet = generatePacketBasalGetRate();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalSetProfileNumber', () => {
    // 0 = A, 1 = B, etc
    const packet = generatePacketBasalSetProfileNumber({ profileNumber: 0 });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalSetProfileRate', () => {
    const packet = generatePacketBasalSetProfileRate({
      profileNumber: 0,
      profileBasalRate: new Array(24).fill(0.5),
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should throw with invalid rate length (basalSetProfileRate)', () => {
    expect(() =>
      generatePacketBasalSetProfileRate({
        profileNumber: 0,
        profileBasalRate: new Array(23).fill(0.5),
      })
    ).toThrow('Invalid basal rate. Expected length = 24');
  });

  it('Should generate basalSetSuspendOff', () => {
    const packet = generatePacketBasalSetSuspendOff();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalSetSuspendOn', () => {
    const packet = generatePacketBasalSetSuspendOn();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate basalSetTemporary', () => {
    const packet = generatePacketBasalSetTemporary({
      temporaryBasalDuration: 1,
      temporaryBasalRatio: 200,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusCancelExtended', () => {
    const packet = generatePacketBolusCancelExtended();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusGet24Circf', () => {
    const packet = generatePacketBolusGet24CIRCFArray();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusGetCalculationInformation', () => {
    const packet = generatePacketBolusGetCalculationInformation();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusGetCircf', () => {
    const packet = generatePacketBolusGetCIRCFArray();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusGetOption', () => {
    const packet = generatePacketBolusGetOption();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusGetStepOptionInformation', () => {
    const packet = generatePacketBolusGetStepInformation();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusSet24Circf', () => {
    const packet = generatePacketBolusSet24CIRCFArray({
      unit: 0,
      ic: new Array(24).fill(0.5),
      isf: new Array(24).fill(1),
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusSet24Circf (mmol/L)', () => {
    const packet = generatePacketBolusSet24CIRCFArray({
      unit: 1,
      ic: new Array(24).fill(0.5),
      isf: new Array(24).fill(1.5),
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should throw if input is invalid bolusSet24Circf', () => {
    expect(() =>
      generatePacketBolusSet24CIRCFArray({
        unit: 0,
        ic: new Array(23).fill(0.5),
        isf: new Array(24).fill(1),
      })
    ).toThrow();
    expect(() =>
      generatePacketBolusSet24CIRCFArray({
        unit: 0,
        ic: new Array(24).fill(0.5),
        isf: new Array(23).fill(1),
      })
    ).toThrow();
  });

  it('Should generate bolusSetExtended', () => {
    const packet = generatePacketBolusSetExtended({
      extendedAmount: 5,
      extendedDurationInHalfHours: 4,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusSetOption', () => {
    const packet = generatePacketBolusSetOption({
      bolusCalculationOption: 1,
      extendedBolusOptionOnOff: 0,
      missedBolus01EndHour: 0,
      missedBolus01EndMin: 0,
      missedBolus01StartHour: 0,
      missedBolus01StartMin: 0,
      missedBolus02EndHour: 0,
      missedBolus02EndMin: 0,
      missedBolus02StartHour: 0,
      missedBolus02StartMin: 0,
      missedBolus03EndHour: 0,
      missedBolus03EndMin: 0,
      missedBolus03StartHour: 0,
      missedBolus03StartMin: 0,
      missedBolus04EndHour: 0,
      missedBolus04EndMin: 0,
      missedBolus04StartHour: 0,
      missedBolus04StartMin: 0,
      missedBolusConfig: 1,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusStart (speed: 12 E/min)', () => {
    const packet = generatePacketBolusStart({
      amount: 5,
      speed: 12,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusStart (speed: 30 E/min)', () => {
    const packet = generatePacketBolusStart({
      amount: 5,
      speed: 30,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusStart (speed: 60 E/min)', () => {
    const packet = generatePacketBolusStart({
      amount: 5,
      speed: 60,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate bolusStop', () => {
    const packet = generatePacketBolusStop();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalAvgBolus', () => {
    const packet = generatePacketGeneralAvgBolus();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalClearUserTimeChangeFlag', () => {
    const packet = generatePacketGeneralClearUserTimeChangeFlag();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetInitialScreenInformation', () => {
    const packet = generatePacketGeneralGetInitialScreenInformation();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetPumpCheck', () => {
    const packet = generatePacketGeneralGetPumpCheck();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetDecRatio', () => {
    const packet = generatePacketGeneralGetPumpDecRatio();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetPumpTime', () => {
    const packet = generatePacketGeneralGetPumpTime();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetPumpTimeWithUtc', () => {
    const packet = generatePacketGeneralGetPumpTimeUtcWithTimezone();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetShippingInformation', () => {
    const packet = generatePacketGeneralGetShippingInformation();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetShippingVersion', () => {
    const packet = generatePacketGeneralGetShippingVersion();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetUserOption', () => {
    const packet = generatePacketGeneralGetUserOption();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalGetUserTimeChangeFlag', () => {
    const packet = generatePacketGeneralGetUserTimeChangeFlag();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalKeepConnection', () => {
    const packet = generatePacketGeneralKeepConnection();
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSaveHistory', () => {
    const packet = generatePacketGeneralSaveHistory({
      historyCode: 1,
      historyDate: new Date(2023, 11, 5, 12, 0, 0, 0),
      historyType: 1,
      historyValue: 1,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSetHistoryUploadMode. Turn on', () => {
    const packet = generatePacketGeneralSetHistoryUploadMode({
      mode: 1,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSetHistoryUploadMode. Turn off', () => {
    const packet = generatePacketGeneralSetHistoryUploadMode({
      mode: 0,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSetPumpTime', () => {
    const packet = generatePacketGeneralSetPumpTime({
      time: new Date(2023, 11, 5, 12, 0, 0, 0),
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSetPumpTimeWithTimezone', () => {
    const packet = generatePacketGeneralSetPumpTimeUtcWithTimezone({
      time: new Date(2023, 11, 5, 12, 0, 0, 0),
      zoneOffset: 1,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate generalSetUserOption', () => {
    const packet = generatePacketGeneralSetUserOption({
      backlightOnTimInSec: 10,
      beepAndAlarm: 0,
      cannulaVolume: 250,
      isButtonScrollOnOff: true,
      isTimeDisplay24H: true,
      lcdOnTimeInSec: 10,
      lowReservoirRate: 20,
      refillAmount: 7,
      selectableLanguage1: 1,
      selectableLanguage2: 2,
      selectableLanguage3: 3,
      selectableLanguage4: 4,
      selectableLanguage5: 5,
      selectedLanguage: 1,
      shutdownHour: 0,
      targetBg: 55,
      units: 1,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyAlarm', () => {
    const packet = generatePacketHistoryAlarm({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyAlarm (from date)', () => {
    const packet = generatePacketHistoryAlarm({ from: new Date(2023, 11, 5, 12, 0, 0, 0) });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyAll', () => {
    const packet = generatePacketHistoryAll({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyBasal', () => {
    const packet = generatePacketHistoryBasal({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyBloodGlucose', () => {
    const packet = generatePacketHistoryBloodGlucose({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyBolus', () => {
    const packet = generatePacketHistoryBolus({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyCarbohydrates', () => {
    const packet = generatePacketHistoryCarbohydrates({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyDaily', () => {
    const packet = generatePacketHistoryDaily({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyPrime', () => {
    const packet = generatePacketHistoryPrime({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyRefill', () => {
    const packet = generatePacketHistoryRefill({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historySuspend', () => {
    const packet = generatePacketHistorySuspend({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate historyTemporary', () => {
    const packet = generatePacketHistoryTemporary({ from: undefined });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopHistoryEvents', () => {
    const packet = generatePacketLoopHistoryEvents({ from: undefined, usingUTC: false });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopHistoryEvents (from date in utc)', () => {
    const packet = generatePacketLoopHistoryEvents({ from: new Date(2023, 11, 5, 12, 0, 0, 0), usingUTC: true });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopSetHistoryEvent', () => {
    const packet = generatePacketLoopSetEventHistory({
      packetType: LoopHistoryEvents.CARBS,
      param1: 0,
      param2: 0,
      time: new Date(2023, 11, 5, 12, 0, 0, 0),
      usingUTC: true,
    });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopSetTemporaryBasal', () => {
    const packet = generatePacketLoopSetTemporaryBasal({ percent: 200 });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopSetTemporaryBasal (percent < 0)', () => {
    const packet = generatePacketLoopSetTemporaryBasal({ percent: -100 });
    expect(packet).toMatchSnapshot();
  });

  it('Should generate loopSetTemporaryBasal (percent > 500)', () => {
    const packet = generatePacketLoopSetTemporaryBasal({ percent: 750 });
    expect(packet).toMatchSnapshot();
  });
});
