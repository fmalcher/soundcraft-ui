import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { AutomixController, AutomixGroup } from './automix-controller';

describe('Automix Controller', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('Response Time', () => {
    let automix: AutomixController;

    beforeEach(() => {
      automix = conn.automix;
    });

    it('responseTime$', async () => {
      conn.conn.sendMessage('SETD^automix.time^1');
      expect(await firstValueFrom(automix.responseTime$)).toBe(1);

      conn.conn.sendMessage('SETD^automix.time^0');
      expect(await firstValueFrom(automix.responseTime$)).toBe(0);

      conn.conn.sendMessage('SETD^automix.time^0.12345');
      expect(await firstValueFrom(automix.responseTime$)).toBe(0.12345);
    });

    it('responseTimeMs$', async () => {
      conn.conn.sendMessage('SETD^automix.time^1');
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(4000);

      conn.conn.sendMessage('SETD^automix.time^0');
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(20);

      conn.conn.sendMessage('SETD^automix.time^0.5');
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(500);
    });

    it('setResponseTime', async () => {
      automix.setResponseTime(0);
      expect(await firstValueFrom(automix.responseTime$)).toBe(0);

      automix.setResponseTime(0.1234);
      expect(await firstValueFrom(automix.responseTime$)).toBe(0.1234);

      automix.setResponseTime(0.5);
      expect(await firstValueFrom(automix.responseTime$)).toBe(0.5);

      automix.setResponseTime(0.777);
      expect(await firstValueFrom(automix.responseTime$)).toBe(0.777);

      automix.setResponseTime(1);
      expect(await firstValueFrom(automix.responseTime$)).toBe(1);
    });

    it('setResponseTimeMs', async () => {
      automix.setResponseTimeMs(20);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(20);

      automix.setResponseTimeMs(999);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(999);

      automix.setResponseTimeMs(2345);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(2345);

      automix.setResponseTimeMs(3100);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(3100);

      automix.setResponseTimeMs(4000);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(4000);

      // bounds
      automix.setResponseTimeMs(0);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(20);

      automix.setResponseTimeMs(-100);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(20);

      automix.setResponseTimeMs(4123);
      expect(await firstValueFrom(automix.responseTimeMs$)).toBe(4000);
    });
  });

  describe('Group State', () => {
    let groupA: AutomixGroup;
    let groupB: AutomixGroup;

    beforeEach(() => {
      groupA = conn.automix.groups.a;
      groupB = conn.automix.groups.b;
    });

    it('state$', async () => {
      // A
      conn.conn.sendMessage('SETD^automix.a.on^1');
      expect(await firstValueFrom(groupA.state$)).toBe(1);

      conn.conn.sendMessage('SETD^automix.b.on^1');
      expect(await firstValueFrom(groupB.state$)).toBe(1);

      // B
      conn.conn.sendMessage('SETD^automix.a.on^0');
      expect(await firstValueFrom(groupA.state$)).toBe(0);

      conn.conn.sendMessage('SETD^automix.b.on^0');
      expect(await firstValueFrom(groupB.state$)).toBe(0);
    });

    it('enable/disable', async () => {
      // A
      groupA.enable();
      expect(await firstValueFrom(groupA.state$)).toBe(1);

      groupA.disable();
      expect(await firstValueFrom(groupA.state$)).toBe(0);

      // B
      groupB.enable();
      expect(await firstValueFrom(groupB.state$)).toBe(1);

      groupB.disable();
      expect(await firstValueFrom(groupB.state$)).toBe(0);
    });

    it('toggle', async () => {
      // A
      groupA.enable();
      groupA.toggle();
      expect(await firstValueFrom(groupA.state$)).toBe(0);

      groupA.toggle();
      expect(await firstValueFrom(groupA.state$)).toBe(1);

      // B
      groupA.disable();
      groupA.toggle();
      expect(await firstValueFrom(groupA.state$)).toBe(1);

      groupA.toggle();
      expect(await firstValueFrom(groupA.state$)).toBe(0);
    });
  });
});
