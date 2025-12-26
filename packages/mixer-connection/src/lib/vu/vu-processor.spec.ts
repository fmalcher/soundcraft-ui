import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom, ReplaySubject, Subject } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { VuProcessor } from './vu-processor';
import { vuMsg24_1, vuMsg24_2 } from './vu-test-messages';

describe('VU Processor', () => {
  let vuProcessor: VuProcessor;
  let inbound$: Subject<string>;

  beforeEach(() => {
    inbound$ = new ReplaySubject(1);
    vuProcessor = new VuProcessor({ inbound$: inbound$ } as unknown as MixerConnection);
  });

  function sendVuMessage(message: string) {
    inbound$.next('VU2^' + message);
  }

  it('vuData$ should emit the full VU state object', async () => {
    sendVuMessage(vuMsg24_2);

    expect(await firstValueFrom(vuProcessor.vuData$)).toEqual({
      aux: [
        {
          vuPost: 0.4959334718006649,
          vuPostFader: 0.500100979967057,
        },
        {
          vuPost: 0.4917659636342727,
          vuPostFader: 0.4959334718006649,
        },
        {
          vuPost: 0.12502524499176426,
          vuPostFader: 0.13336026132454853,
        },
        {
          vuPost: 0.12502524499176426,
          vuPostFader: 0.13336026132454853,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
        },
        {
          vuPost: 0.45842589830313557,
          vuPostFader: 0.3500706859769399,
        },
        {
          vuPost: 0.4500908819703513,
          vuPostFader: 0.34173566964415564,
        },
      ],
      fx: [
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0.6959738637874877,
          vuPostFaderR: 0.6834713392883113,
          vuPostL: 0.6709688147891348,
          vuPostR: 0.6584662902899584,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
      ],
      input: [
        {
          vuPost: 0.6626337984563505,
          vuPostFader: 0.6959738637874877,
          vuPre: 0.675136322955527,
        },
        {
          vuPost: 0.6626337984563505,
          vuPostFader: 0.6959738637874877,
          vuPre: 0.675136322955527,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0.1500302939901171,
          vuPostFader: 0,
          vuPre: 0.15836531032290138,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0.0500100979967057,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
      ],
      line: [
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
      ],
      master: [
        {
          vuPost: 0.7334814372850169,
          vuPostFader: 0.7168114046194484,
        },
        {
          vuPost: 0.7251464209522327,
          vuPostFader: 0.708476388286664,
        },
      ],
      player: [
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
        {
          vuPost: 0,
          vuPostFader: 0,
          vuPre: 0,
        },
      ],
      sub: [
        {
          vuPostFaderL: 0.6959738637874877,
          vuPostFaderR: 0.6918063556210955,
          vuPostL: 0.7001413719538798,
          vuPostR: 0.6959738637874877,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
        {
          vuPostFaderL: 0,
          vuPostFaderR: 0,
          vuPostL: 0,
          vuPostR: 0,
        },
      ],
    });
  });

  it('should publish data for input', async () => {
    const stream$ = vuProcessor.input(1);
    sendVuMessage(vuMsg24_1);

    expect(await firstValueFrom(stream$)).toEqual({
      vuPost: 0,
      vuPostFader: 0,
      vuPre: 0,
    });

    sendVuMessage(vuMsg24_2);

    expect(await firstValueFrom(stream$)).toEqual({
      vuPost: 0.6626337984563505,
      vuPostFader: 0.6959738637874877,
      vuPre: 0.675136322955527,
    });
  });

  it('should publish data for player', async () => {
    const stream$ = vuProcessor.player(1);
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPre: 0,
      vuPost: 0,
      vuPostFader: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPre: 0,
      vuPost: 0,
      vuPostFader: 0,
    });
  });

  it('should publish data for line', async () => {
    const stream$ = vuProcessor.line(1);
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPre: 0,
      vuPost: 0,
      vuPostFader: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPre: 0,
      vuPost: 0,
      vuPostFader: 0,
    });
  });

  it('should publish data for AUX', async () => {
    const stream$ = vuProcessor.aux(1);
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPost: 0,
      vuPostFader: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPost: 0.4959334718006649,
      vuPostFader: 0.500100979967057,
    });
  });

  it('should publish data for sub group', async () => {
    const stream$ = vuProcessor.sub(1);
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0,
      vuPostFaderR: 0,
      vuPostL: 0,
      vuPostR: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0.6959738637874877,
      vuPostFaderR: 0.6918063556210955,
      vuPostL: 0.7001413719538798,
      vuPostR: 0.6959738637874877,
    });
  });

  it('should publish data for FX', async () => {
    const stream$ = vuProcessor.fx(2);
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0,
      vuPostFaderR: 0,
      vuPostL: 0,
      vuPostR: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0.6959738637874877,
      vuPostFaderR: 0.6834713392883113,
      vuPostL: 0.6709688147891348,
      vuPostR: 0.6584662902899584,
    });
  });

  it('should publish data for master', async () => {
    const stream$ = vuProcessor.master();
    sendVuMessage(vuMsg24_1);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0,
      vuPostFaderR: 0,
      vuPostL: 0,
      vuPostR: 0,
    });

    sendVuMessage(vuMsg24_2);
    expect(await firstValueFrom(stream$)).toEqual({
      vuPostFaderL: 0.7168114046194484,
      vuPostFaderR: 0.708476388286664,
      vuPostL: 0.7334814372850169,
      vuPostR: 0.7251464209522327,
    });
  });
});
