import { DBToFaderValueCALC, faderValueToDBCALC, sanitizeDelayValue } from './value-converters';

describe('Value converters', () => {
  it('should sanitize and convert valid delay values', () => {
    expect(sanitizeDelayValue(500, 500)).toBe(0.5);
    expect(sanitizeDelayValue(200, 500)).toBe(0.2);
    expect(sanitizeDelayValue(333, 500)).toBe(0.333);
    expect(sanitizeDelayValue(0, 500)).toBe(0);
  });

  it('should sanitize out-of-range delay values', () => {
    expect(sanitizeDelayValue(600, 500)).toBe(0.5);
    expect(sanitizeDelayValue(-10, 500)).toBe(0);
    expect(sanitizeDelayValue(201, 200)).toBe(0.2);
  });

  it('should convert linear value to dB value', () => {
    expect(faderValueToDBCALC(0.98056922374235)).toMatchInlineSnapshot(`9`);
    expect(faderValueToDBCALC(0.9165390820271568)).toMatchInlineSnapshot(`6`);
    expect(faderValueToDBCALC(0.8932095183699857)).toMatchInlineSnapshot(`5`);
    expect(faderValueToDBCALC(0.8689202935784124)).toMatchInlineSnapshot(`4`);
    expect(faderValueToDBCALC(0.8437562720209826)).toMatchInlineSnapshot(`3`);
    expect(faderValueToDBCALC(0.8178584068082273)).toMatchInlineSnapshot(`2`);
    expect(faderValueToDBCALC(0.7914255296927877)).toMatchInlineSnapshot(`1`);
    expect(faderValueToDBCALC(0.7647058823495172)).toMatchInlineSnapshot(`0`);
    expect(faderValueToDBCALC(0.7379774276050739)).toMatchInlineSnapshot(`-0.9`);
    expect(faderValueToDBCALC(0.7115203608991578)).toMatchInlineSnapshot(`-1.9`);
    expect(faderValueToDBCALC(0.6855889220023528)).toMatchInlineSnapshot(`-2.9`);
    expect(faderValueToDBCALC(0.612728497479111)).toMatchInlineSnapshot(`-5.9`);
    expect(faderValueToDBCALC(0.5487738897791132)).toMatchInlineSnapshot(`-8.9`);
    expect(faderValueToDBCALC(0.4933368943165988)).toMatchInlineSnapshot(`-11.9`);
    expect(faderValueToDBCALC(0.4450032153399661)).toMatchInlineSnapshot(`-14.9`);
    expect(faderValueToDBCALC(0.4023566844407469)).toMatchInlineSnapshot(`-17.9`);
    expect(faderValueToDBCALC(0.37650583661161363)).toMatchInlineSnapshot(`-19.9`);
    expect(faderValueToDBCALC(0.2693554200232029)).toMatchInlineSnapshot(`-29.9`);
    expect(faderValueToDBCALC(0.11764705926179886)).toMatchInlineSnapshot(`-49.9`);
    expect(faderValueToDBCALC(0.05882352590560913)).toMatchInlineSnapshot(`-59.9`);
    expect(faderValueToDBCALC(0.025155186653137207)).toMatchInlineSnapshot(`-69.9`);
    expect(faderValueToDBCALC(0.010385841131210327)).toMatchInlineSnapshot(`-79.9`);
    expect(faderValueToDBCALC(0.003787517547607422)).toMatchInlineSnapshot(`-89.9`);
    expect(faderValueToDBCALC(0.001269415020942688)).toMatchInlineSnapshot(`-99.9`);
    expect(faderValueToDBCALC(0)).toMatchInlineSnapshot(`-Infinity`);
  });

  it('should convert dB value to linear value', () => {
    expect(DBToFaderValueCALC(10)).toMatchInlineSnapshot(`1`);
    expect(DBToFaderValueCALC(9)).toMatchInlineSnapshot(`0.98056922374235`);
    expect(DBToFaderValueCALC(6)).toMatchInlineSnapshot(`0.9165390820271568`);
    expect(DBToFaderValueCALC(5)).toMatchInlineSnapshot(`0.8932095183699857`);
    expect(DBToFaderValueCALC(4)).toMatchInlineSnapshot(`0.8689202935784124`);
    expect(DBToFaderValueCALC(3)).toMatchInlineSnapshot(`0.8437562720209826`);
    expect(DBToFaderValueCALC(2)).toMatchInlineSnapshot(`0.8178584068082273`);
    expect(DBToFaderValueCALC(1)).toMatchInlineSnapshot(`0.7914255296927877`);
    expect(DBToFaderValueCALC(0)).toMatchInlineSnapshot(`0.7647058823495172`);
    expect(DBToFaderValueCALC(-1)).toMatchInlineSnapshot(`0.7379774276050739`);
    expect(DBToFaderValueCALC(-2)).toMatchInlineSnapshot(`0.7115203608991578`);
    expect(DBToFaderValueCALC(-3)).toMatchInlineSnapshot(`0.6855889220023528`);
    expect(DBToFaderValueCALC(-6)).toMatchInlineSnapshot(`0.612728497479111`);
    expect(DBToFaderValueCALC(-9)).toMatchInlineSnapshot(`0.5487738897791132`);
    expect(DBToFaderValueCALC(-12)).toMatchInlineSnapshot(`0.4933368943165988`);
    expect(DBToFaderValueCALC(-15)).toMatchInlineSnapshot(`0.4450032153399661`);
    expect(DBToFaderValueCALC(-18)).toMatchInlineSnapshot(`0.4023566844407469`);
    expect(DBToFaderValueCALC(-20)).toMatchInlineSnapshot(`0.37650583661161363`);
    expect(DBToFaderValueCALC(-30)).toMatchInlineSnapshot(`0.2693554200232029`);
    expect(DBToFaderValueCALC(-50)).toMatchInlineSnapshot(`0.11764705926179886`);
    expect(DBToFaderValueCALC(-60)).toMatchInlineSnapshot(`0.05882352590560913`);
    expect(DBToFaderValueCALC(-70)).toMatchInlineSnapshot(`0.025155186653137207`);
    expect(DBToFaderValueCALC(-80)).toMatchInlineSnapshot(`0.010385841131210327`);
    expect(DBToFaderValueCALC(-90)).toMatchInlineSnapshot(`0.003787517547607422`);
    expect(DBToFaderValueCALC(-100)).toMatchInlineSnapshot(`0.001269415020942688`);
    expect(DBToFaderValueCALC(-Infinity)).toMatchInlineSnapshot(`0`);
  });
});
