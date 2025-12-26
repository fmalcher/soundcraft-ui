import { describe, it, expect, beforeEach } from 'vitest';
import { AuxChannel, DelayableMasterChannel, MasterBus, MasterChannel } from './facade';
import { SoundcraftUI } from './soundcraft-ui';
import { isChannel, isDelayableMasterChannel, isMaster, isMasterChannel } from './type-guards';

describe('Type Guards', () => {
  let master: MasterBus;
  let masterChannel: MasterChannel;
  let delMasterChannel: DelayableMasterChannel;
  let auxChannel: AuxChannel;

  beforeEach(() => {
    const conn = new SoundcraftUI('0.0.0.0');

    masterChannel = conn.master.player(1);
    delMasterChannel = conn.master.input(1);
    auxChannel = conn.aux(1).input(1);
    master = conn.master;
  });

  it('isChannel', () => {
    expect(isChannel(masterChannel)).toBe(true);
    expect(isChannel(delMasterChannel)).toBe(true);
    expect(isChannel(auxChannel)).toBe(true);

    expect(isChannel(master)).toBe(false);
  });

  it('isMasterChannel', () => {
    expect(isMasterChannel(masterChannel)).toBe(true);
    expect(isMasterChannel(delMasterChannel)).toBe(true);

    expect(isMasterChannel(auxChannel)).toBe(false);
    expect(isMasterChannel(master)).toBe(false);
  });

  it('isDelayableMasterChannel', () => {
    expect(isDelayableMasterChannel(delMasterChannel)).toBe(true);

    expect(isDelayableMasterChannel(masterChannel)).toBe(false);
    expect(isDelayableMasterChannel(auxChannel)).toBe(false);
    expect(isDelayableMasterChannel(master)).toBe(false);
  });

  it('isMaster', () => {
    expect(isMaster(master)).toBe(true);

    expect(isMaster(masterChannel)).toBe(false);
    expect(isMaster(delMasterChannel)).toBe(false);
    expect(isMaster(auxChannel)).toBe(false);
  });
});
