import { describe, it, expect } from 'vitest';
import { of, firstValueFrom } from 'rxjs';

import {
  select,
  selectRawValue,
  selectMasterValue,
  selectMasterPan,
  selectMasterDim,
  selectMasterDelay,
  selectPan,
  selectMute,
  selectSolo,
  selectFaderValue,
  selectDelayValue,
  selectPost,
  selectAuxPostProc,
  selectFxBpm,
  selectFxType,
  selectStereoIndex,
  selectPhantom,
  selectGain,
  selectVolumeBusValue,
  selectPlayerLength,
  selectPlayerCurrentTrackPos,
  selectPlayerElapsedTime,
  selectPlayerRemainingTime,
  selectMtkLength,
  selectMtkCurrentTrackPos,
  selectMtkElapsedTime,
  selectMtkRemainingTime,
} from './state-selectors';

describe('State Selectors', () => {
  describe('select operator', () => {
    it('should pipe state through the projector', async () => {
      const state = { 'm.mix': 0.75 };
      const result = await firstValueFrom(of(state).pipe(select(selectMasterValue())));
      expect(result).toBe(0.75);
    });

    it('should filter undefined values', async () => {
      const values: number[] = [];
      of({ 'm.mix': undefined }, { 'm.mix': 0.5 })
        .pipe(select(selectMasterValue()))
        .subscribe(v => values.push(v));
      expect(values).toEqual([0.5]);
    });

    it('should filter duplicate values', async () => {
      const values: number[] = [];
      of({ 'm.mix': 0.5 }, { 'm.mix': 0.5 }, { 'm.mix': 0.7 })
        .pipe(select(selectMasterValue()))
        .subscribe(v => values.push(v));
      expect(values).toEqual([0.5, 0.7]);
    });
  });

  describe('selectRawValue', () => {
    it('should read value at the given path', async () => {
      const state = { 'i.0.mix': 0.6 };
      const result = await firstValueFrom(of(state).pipe(selectRawValue('i.0.mix')));
      expect(result).toBe(0.6);
    });

    it('should apply a default value when the path is missing', async () => {
      const state = {};
      const values: number[] = [];
      of(state)
        .pipe(selectRawValue<number>('missing.path', 42))
        .subscribe(v => values.push(v));
      expect(values).toEqual([42]);
    });
  });

  describe('Master selectors', () => {
    it('selectMasterValue should read m.mix', () => {
      const projector = selectMasterValue();
      expect(projector({ 'm.mix': 0.85 })).toBe(0.85);
    });

    it('selectMasterPan should read m.pan', () => {
      const projector = selectMasterPan();
      expect(projector({ 'm.pan': 0.3 })).toBe(0.3);
    });

    it('selectMasterDim should read m.dim', () => {
      const projector = selectMasterDim();
      expect(projector({ 'm.dim': 1 })).toBe(1);
    });

    it('selectMasterDelay L should read m.delayL and multiply by 1000', () => {
      const projector = selectMasterDelay('L');
      expect(projector({ 'm.delayL': 0.5 })).toBe(500);
    });

    it('selectMasterDelay R should read m.delayR and multiply by 1000', () => {
      const projector = selectMasterDelay('R');
      expect(projector({ 'm.delayR': 0.35 })).toBe(350);
    });

    it('selectMasterDelay should default to 0 when path is missing', () => {
      const projector = selectMasterDelay('L');
      expect(projector({})).toBe(0);
    });
  });

  describe('Channel selectors with busType switch', () => {
    describe('selectPan', () => {
      it('should read pan for master bus', () => {
        const projector = selectPan('i', 3, 'master');
        expect(projector({ 'i.2.pan': 0.4 })).toBe(0.4);
      });

      it('should default to 0 for master bus', () => {
        const projector = selectPan('i', 3, 'master');
        expect(projector({})).toBe(0);
      });

      it('should read pan for aux bus', () => {
        const projector = selectPan('i', 1, 'aux', 2);
        expect(projector({ 'i.0.aux.1.pan': 0.7 })).toBe(0.7);
      });

      it('should read pan for fx bus', () => {
        const projector = selectPan('l', 2, 'fx', 3);
        expect(projector({ 'l.1.fx.2.pan': 0.9 })).toBe(0.9);
      });
    });

    describe('selectMute', () => {
      it('should read mute for master bus', () => {
        const projector = selectMute('i', 1, 'master');
        expect(projector({ 'i.0.mute': 1 })).toBe(1);
      });

      it('should default to 0 for master bus', () => {
        const projector = selectMute('i', 1, 'master');
        expect(projector({})).toBe(0);
      });

      it('should read mute for aux bus', () => {
        const projector = selectMute('i', 2, 'aux', 1);
        expect(projector({ 'i.1.aux.0.mute': 1 })).toBe(1);
      });

      it('should read mute for fx bus', () => {
        const projector = selectMute('l', 3, 'fx', 2);
        expect(projector({ 'l.2.fx.1.mute': 1 })).toBe(1);
      });
    });

    describe('selectFaderValue', () => {
      it('should read mix for master bus', () => {
        const projector = selectFaderValue('i', 3, 'master');
        expect(projector({ 'i.2.mix': 0.6 })).toBe(0.6);
      });

      it('should read value for aux bus', () => {
        const projector = selectFaderValue('i', 1, 'aux', 2);
        expect(projector({ 'i.0.aux.1.value': 0.8 })).toBe(0.8);
      });

      it('should read value for fx bus', () => {
        const projector = selectFaderValue('l', 2, 'fx', 3);
        expect(projector({ 'l.1.fx.2.value': 0.3 })).toBe(0.3);
      });
    });
  });

  describe('selectSolo', () => {
    it('should read solo state for a channel', () => {
      const projector = selectSolo('i', 3);
      expect(projector({ 'i.2.solo': 1 })).toBe(1);
    });

    it('should return undefined when path is missing', () => {
      const projector = selectSolo('i', 3);
      expect(projector({})).toBeUndefined();
    });
  });

  describe('selectDelayValue', () => {
    it('should read delay and multiply by 1000', () => {
      const projector = selectDelayValue('i', 2);
      expect(projector({ 'i.1.delay': 0.25 })).toBe(250);
    });

    it('should default to 0 when path is missing', () => {
      const projector = selectDelayValue('i', 2);
      expect(projector({})).toBe(0);
    });
  });

  describe('selectPost', () => {
    it('should read post value for a send channel', () => {
      const projector = selectPost('i', 3, 'aux', 2);
      expect(projector({ 'i.2.aux.1.post': 1 })).toBe(1);
    });

    it('should default to 0', () => {
      const projector = selectPost('i', 3, 'aux', 2);
      expect(projector({})).toBe(0);
    });
  });

  describe('selectAuxPostProc', () => {
    it('should read postproc value for an aux send', () => {
      const projector = selectAuxPostProc('i', 4, 2);
      expect(projector({ 'i.3.aux.1.postproc': 1 })).toBe(1);
    });

    it('should default to 0', () => {
      const projector = selectAuxPostProc('i', 4, 2);
      expect(projector({})).toBe(0);
    });
  });

  describe('selectFxBpm', () => {
    it('should read bpm value for an FX bus', () => {
      const projector = selectFxBpm(2);
      expect(projector({ 'f.1.bpm': 120 })).toBe(120);
    });

    it('should default bus to 1', () => {
      const projector = selectFxBpm();
      expect(projector({ 'f.0.bpm': 100 })).toBe(100);
    });
  });

  describe('selectFxType', () => {
    it('should read fxtype for an FX bus', () => {
      const projector = selectFxType(3);
      expect(projector({ 'f.2.fxtype': 2 })).toBe(2);
    });

    it('should default bus to 1', () => {
      const projector = selectFxType();
      expect(projector({ 'f.0.fxtype': 0 })).toBe(0);
    });
  });

  describe('selectStereoIndex', () => {
    it('should return stereo index for input channel', () => {
      const projector = selectStereoIndex('i', 2);
      expect(projector({ 'i.1.stereoIndex': 0 })).toBe(0);
    });

    it('should return stereo index for line channel', () => {
      const projector = selectStereoIndex('l', 1);
      expect(projector({ 'l.0.stereoIndex': 1 })).toBe(1);
    });

    it('should return stereo index for player channel', () => {
      const projector = selectStereoIndex('p', 1);
      expect(projector({ 'p.0.stereoIndex': 0 })).toBe(0);
    });

    it('should return stereo index for aux channel', () => {
      const projector = selectStereoIndex('a', 1);
      expect(projector({ 'a.0.stereoIndex': 0 })).toBe(0);
    });

    it('should default to -1 for linkable types when path missing', () => {
      const projector = selectStereoIndex('i', 1);
      expect(projector({})).toBe(-1);
    });

    it('should return -1 for fx return channels', () => {
      const projector = selectStereoIndex('f', 1);
      expect(projector({ 'f.0.stereoIndex': 0 })).toBe(-1);
    });

    it('should return -1 for sub group channels', () => {
      const projector = selectStereoIndex('s', 1);
      expect(projector({ 's.0.stereoIndex': 0 })).toBe(-1);
    });
  });

  describe('selectPhantom', () => {
    it('should read phantom state with hw key', () => {
      const projector = selectPhantom(3, 'hw');
      expect(projector({ 'hw.2.phantom': 1 })).toBe(1);
    });

    it('should read phantom state with i key', () => {
      const projector = selectPhantom(1, 'i');
      expect(projector({ 'i.0.phantom': 1 })).toBe(1);
    });
  });

  describe('selectGain', () => {
    it('should read gain with hw key', () => {
      const projector = selectGain(2, 'hw');
      expect(projector({ 'hw.1.gain': 0.65 })).toBe(0.65);
    });

    it('should read gain with i key', () => {
      const projector = selectGain(4, 'i');
      expect(projector({ 'i.3.gain': 0.8 })).toBe(0.8);
    });
  });

  describe('selectVolumeBusValue', () => {
    it('should read volume bus value without busId', () => {
      const projector = selectVolumeBusValue('solovol');
      expect(projector({ 'settings.solovol': 0.5 })).toBe(0.5);
    });

    it('should read volume bus value with busId', () => {
      const projector = selectVolumeBusValue('hpvol', 0);
      expect(projector({ 'settings.hpvol.0': 0.7 })).toBe(0.7);
    });

    it('should read volume bus value with busId > 0', () => {
      const projector = selectVolumeBusValue('hpvol', 1);
      expect(projector({ 'settings.hpvol.1': 0.9 })).toBe(0.9);
    });
  });

  describe('Player selectors', () => {
    it('selectPlayerLength should read var.currentLength', () => {
      const projector = selectPlayerLength();
      expect(projector({ 'var.currentLength': 180 })).toBe(180);
    });

    it('selectPlayerLength should default to -1', () => {
      const projector = selectPlayerLength();
      expect(projector({})).toBe(-1);
    });

    it('selectPlayerCurrentTrackPos should read var.currentTrackPos', () => {
      const projector = selectPlayerCurrentTrackPos();
      expect(projector({ 'var.currentTrackPos': 0.5 })).toBe(0.5);
    });

    it('selectPlayerCurrentTrackPos should default to 0', () => {
      const projector = selectPlayerCurrentTrackPos();
      expect(projector({})).toBe(0);
    });

    it('selectPlayerElapsedTime should calculate pos * length, floored', () => {
      const projector = selectPlayerElapsedTime();
      const state = { 'var.currentTrackPos': 0.333, 'var.currentLength': 100 };
      expect(projector(state)).toBe(33); // floor(0.333 * 100) = 33
    });

    it('selectPlayerElapsedTime should return minimum 0', () => {
      const projector = selectPlayerElapsedTime();
      const state = { 'var.currentTrackPos': -0.5, 'var.currentLength': 100 };
      expect(projector(state)).toBe(0);
    });

    it('selectPlayerRemainingTime should calculate length - elapsed, floored', () => {
      const projector = selectPlayerRemainingTime();
      const state = { 'var.currentTrackPos': 0.5, 'var.currentLength': 200 };
      // elapsed = floor(0.5 * 200) = 100, remaining = floor(200 - 100) = 100
      expect(projector(state)).toBe(100);
    });

    it('selectPlayerRemainingTime should return minimum 0', () => {
      const projector = selectPlayerRemainingTime();
      const state = { 'var.currentTrackPos': 1.5, 'var.currentLength': 100 };
      // elapsed = floor(1.5 * 100) = 150, remaining = max(0, floor(100 - 150)) = 0
      expect(projector(state)).toBe(0);
    });
  });

  describe('Multitrack selectors', () => {
    it('selectMtkLength should read var.mtk.currentLength', () => {
      const projector = selectMtkLength();
      expect(projector({ 'var.mtk.currentLength': 300 })).toBe(300);
    });

    it('selectMtkLength should default to -1', () => {
      const projector = selectMtkLength();
      expect(projector({})).toBe(-1);
    });

    it('selectMtkCurrentTrackPos should read var.mtk.currentTrackPos', () => {
      const projector = selectMtkCurrentTrackPos();
      expect(projector({ 'var.mtk.currentTrackPos': 0.75 })).toBe(0.75);
    });

    it('selectMtkCurrentTrackPos should default to 0', () => {
      const projector = selectMtkCurrentTrackPos();
      expect(projector({})).toBe(0);
    });

    it('selectMtkElapsedTime should calculate pos * length, floored', () => {
      const projector = selectMtkElapsedTime();
      const state = { 'var.mtk.currentTrackPos': 0.25, 'var.mtk.currentLength': 400 };
      expect(projector(state)).toBe(100); // floor(0.25 * 400) = 100
    });

    it('selectMtkElapsedTime should return minimum 0', () => {
      const projector = selectMtkElapsedTime();
      const state = { 'var.mtk.currentTrackPos': -1, 'var.mtk.currentLength': 100 };
      expect(projector(state)).toBe(0);
    });

    it('selectMtkRemainingTime should calculate length - elapsed, floored', () => {
      const projector = selectMtkRemainingTime();
      const state = { 'var.mtk.currentTrackPos': 0.5, 'var.mtk.currentLength': 200 };
      expect(projector(state)).toBe(100);
    });

    it('selectMtkRemainingTime should return minimum 0', () => {
      const projector = selectMtkRemainingTime();
      const state = { 'var.mtk.currentTrackPos': 2, 'var.mtk.currentLength': 100 };
      expect(projector(state)).toBe(0);
    });
  });
});
