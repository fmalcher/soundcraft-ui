import { describe, it, expect } from 'vitest';
import { parseVuMessageArray, vuMessageToArray } from './vu.utils';
import { vuMsg24_1, vuMsg24_2, vuMsg12_1 } from './vu-test-messages';

describe('VU utils', () => {
  describe('vuMessageToArray', () => {
    it('should decode base64 message to array (vuMsg24_1)', () => {
      const result = vuMessageToArray(vuMsg24_1);
      // prettier-ignore
      expect(Array.from(result)).toEqual([
        24, 2, 6, 4, 10, 2, 2, 0, // Preamble
        0, 0, 0, 0, 0, 247,    // Input 1
        0, 0, 0, 0, 0, 247,    // Input 2
        0, 0, 0, 0, 0, 247,    // Input 3
        0, 0, 0, 0, 0, 247,    // Input 4
        0, 0, 0, 0, 0, 247,    // Input 5
        0, 0, 0, 0, 0, 247,    // Input 6
        0, 0, 0, 0, 0, 247,    // Input 7
        0, 0, 0, 0, 0, 247,    // Input 8
        0, 0, 0, 0, 0, 247,    // Input 9
        0, 0, 0, 0, 0, 247,    // Input 10
        0, 0, 0, 0, 0, 247,    // Input 11
        0, 0, 0, 0, 0, 247,    // Input 12
        0, 0, 0, 0, 0, 247,    // Input 13
        0, 0, 0, 0, 0, 247,    // Input 14
        0, 0, 0, 0, 0, 247,    // Input 15
        0, 0, 0, 0, 0, 247,    // Input 16
        0, 0, 0, 0, 0, 247,    // Input 17
        0, 0, 0, 0, 0, 247,    // Input 18
        0, 0, 0, 0, 0, 119,    // Input 19
        8, 0, 0, 7, 0, 119,    // Input 20
        0, 0, 0, 0, 0, 247,    // Input 21
        0, 0, 0, 0, 0, 247,    // Input 22
        0, 0, 0, 0, 0, 247,    // Input 23
        0, 0, 0, 0, 0, 247,    // Input 24
        0, 0, 0, 0, 0, 247,    // Player 1
        0, 0, 0, 0, 0, 247,    // Player 2
        0, 0, 0, 0, 0, 0, 247, // Sub 1
        0, 0, 0, 0, 0, 0, 247, // Sub 2
        0, 0, 0, 0, 0, 0, 247, // Sub 3
        0, 0, 0, 0, 0, 0, 247, // Sub 4
        0, 0, 0, 0, 0, 0, 247, // Sub 5
        0, 0, 0, 0, 0, 0, 247, // Sub 6
        0, 0, 0, 0, 0, 0, 247, // FX 1
        0, 0, 0, 0, 0, 0, 247, // FX 2
        0, 0, 0, 0, 0, 0, 247, // FX 3
        0, 0, 0, 0, 0, 0, 247, // FX 4
        0, 0, 0, 0, 247,       // AUX 1
        0, 0, 0, 0, 247,       // AUX 2
        0, 0, 0, 0, 247,       // AUX 3
        0, 0, 0, 0, 247,       // AUX 4
        0, 0, 0, 0, 247,       // AUX 5
        0, 0, 0, 0, 247,       // AUX 6
        0, 0, 0, 0, 247,       // AUX 7
        0, 0, 0, 0, 247,       // AUX 8
        0, 0, 0, 0, 247,       // AUX 9
        0, 0, 0, 0, 247,       // AUX 10
        0, 0, 0, 0, 247,       // Master 1
        0, 0, 0, 0, 247,       // Master 2
        0, 0, 0, 0, 0, 247,    // Line 1
        0, 0, 0, 0, 0, 247,    // Line 2
      ]);
    });

    it('should decode base64 message to array (vuMsg24_2)', () => {
      const result = vuMessageToArray(vuMsg24_2);
      // prettier-ignore
      expect(Array.from(result)).toEqual([
        24, 2, 6, 4, 10, 2, 2, 0, // Preamble
        162, 159, 167, 162, 160, 247, // Input 1
        162, 159, 167, 162, 161, 247, // Input 2
        0, 0, 0, 0, 0, 247, // Input 3
        0, 0, 0, 0, 0, 247, // Input 4
        0, 0, 0, 0, 0, 247, // Input 5
        0, 0, 0, 0, 0, 247, // Input 6
        0, 0, 0, 0, 0, 247, // Input 7
        0, 0, 0, 0, 0, 247, // Input 8
        0, 0, 0, 0, 0, 247, // Input 9
        0, 0, 0, 0, 0, 247, // Input 10
        38, 36, 0, 0, 33, 247, // Input 11
        0, 0, 0, 0, 0, 247, // Input 12
        0, 0, 0, 0, 0, 247, // Input 13
        0, 0, 0, 0, 0, 247, // Input 14
        0, 0, 0, 0, 0, 247, // Input 15
        0, 0, 0, 0, 0, 247, // Input 16
        0, 0, 0, 0, 0, 247, // Input 17
        0, 0, 0, 0, 0, 247, // Input 18
        0, 0, 0, 0, 0, 119, // Input 19
        12, 0, 0, 7, 0, 119, // Input 20
        0, 0, 0, 0, 0, 247, // Input 21
        0, 0, 0, 0, 0, 247, // Input 22
        0, 0, 0, 0, 0, 247, // Input 23
        0, 0, 0, 0, 0, 247, // Input 24
        0, 0, 0, 0, 0, 247, // Player 1
        0, 0, 0, 0, 0, 247, // Player 2
        168, 167, 167, 166, 168, 168, 247, // Sub 1
        0, 0, 0, 0, 0, 0, 247, // Sub 2
        0, 0, 0, 0, 0, 0, 247, // Sub 3
        0, 0, 0, 0, 0, 0, 247, // Sub 4
        0, 0, 0, 0, 0, 0, 247, // Sub 5
        0, 0, 0, 0, 0, 0, 247, // Sub 6
        0, 0, 0, 0, 0, 0, 247, // FX 1
        161, 158, 167, 164, 161, 158, 247, // FX 2
        0, 0, 0, 0, 0, 0, 247, // FX 3
        0, 0, 0, 0, 0, 0, 247, // FX 4
        119, 120, 119, 119, 247, // AUX 1
        118, 119, 118, 118, 247, // AUX 2
        30, 32, 30, 29, 247, // AUX 3
        30, 32, 30, 29, 247, // AUX 4
        0, 0, 0, 0, 247, // AUX 5
        0, 0, 0, 0, 247, // AUX 6
        0, 0, 0, 0, 247, // AUX 7
        0, 0, 0, 0, 247, // AUX 8
        110, 84, 111, 109, 246, // AUX 9
        108, 82, 110, 109, 247, // AUX 10
        176, 172, 176, 173, 247, // Master 1
        174, 170, 0, 173, 247, // Master 2
        0, 0, 0, 0, 0, 247, // Line 1
        0, 0, 0, 0, 0, 247 // Line 2
      ]);
    });

    it('should decode base64 message to array (vuMsg12_1)', () => {
      const result = vuMessageToArray(vuMsg12_1);
      // prettier-ignore
      expect(Array.from(result)).toEqual([
        8, 2, 4, 4, 4, 2, 2, 0, // Preamble
        0, 0, 0, 0, 0, 247, // Input 1
        0, 0, 0, 0, 0, 247, // Input 2
        0, 0, 0, 0, 0, 247, // Input 3
        0, 0, 0, 0, 0, 247, // Input 4
        0, 0, 0, 0, 0, 247, // Input 5
        0, 0, 0, 0, 0, 247, // Input 6
        0, 0, 0, 0, 0, 247, // Input 7
        0, 0, 0, 0, 0, 247, // Input 8
        0, 0, 0, 0, 0, 247, // Player 1
        0, 0, 0, 0, 0, 247, // Player 2
        0, 0, 0, 0, 0, 0, 247, // Sub 1
        0, 0, 0, 0, 0, 0, 247, // Sub 2
        0, 0, 0, 0, 0, 0, 247, // Sub 3
        0, 0, 0, 0, 0, 0, 247, // Sub 4
        0, 0, 0, 0, 0, 0, 247, // FX 1
        0, 0, 0, 0, 0, 0, 247, // FX 2
        0, 0, 0, 0, 0, 0, 247, // FX 3
        0, 0, 0, 0, 0, 0, 247, // FX 4
        0, 0, 0, 0, 247, // AUX 1
        0, 0, 0, 0, 247, // AUX 2
        0, 0, 0, 0, 247, // AUX 3
        0, 0, 0, 0, 247, // AUX 4
        0, 0, 0, 0, 247, // Master 1
        0, 0, 0, 0, 247, // Master 2
        0, 0, 0, 0, 0, 247, // Line 1
        0, 0, 0, 0, 0, 247, // Line 2
      ]);
    });
  });

  describe('parseVuMessageArray', () => {
    it('should decode message array to VuData object (vuMsg12_1)', () => {
      const result = parseVuMessageArray(vuMessageToArray(vuMsg12_1));
      expect(result).toEqual({
        input: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        player: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        sub: [
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        fx: [
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        aux: [
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
        ],
        master: [
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
        ],
        line: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
      });
    });

    it('should decode message array to VuData object (vuMsg24_1)', () => {
      const result = parseVuMessageArray(vuMessageToArray(vuMsg24_1));
      expect(result).toEqual({
        input: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0.033340065331137134, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        player: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        sub: [
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        fx: [
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        aux: [
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
        ],
        master: [
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
        ],
        line: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
      });
    });

    it('should decode message array to VuData object (vuMsg24_2)', () => {
      const result = parseVuMessageArray(vuMessageToArray(vuMsg24_2));
      expect(result).toEqual({
        input: [
          { vuPost: 0.6626337984563505, vuPostFader: 0.6959738637874877, vuPre: 0.675136322955527 },
          { vuPost: 0.6626337984563505, vuPostFader: 0.6959738637874877, vuPre: 0.675136322955527 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0.15836531032290138, vuPost: 0.1500302939901171, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0.0500100979967057, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        player: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
        sub: [
          {
            vuPostFaderL: 0.6959738637874877,
            vuPostFaderR: 0.6918063556210955,
            vuPostL: 0.7001413719538798,
            vuPostR: 0.6959738637874877,
          },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        fx: [
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          {
            vuPostL: 0.6709688147891348,
            vuPostR: 0.6584662902899584,
            vuPostFaderL: 0.6959738637874877,
            vuPostFaderR: 0.6834713392883113,
          },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
          { vuPostL: 0, vuPostR: 0, vuPostFaderL: 0, vuPostFaderR: 0 },
        ],
        aux: [
          { vuPost: 0.4959334718006649, vuPostFader: 0.500100979967057 },
          { vuPost: 0.4917659636342727, vuPostFader: 0.4959334718006649 },
          { vuPost: 0.12502524499176426, vuPostFader: 0.13336026132454853 },
          { vuPost: 0.12502524499176426, vuPostFader: 0.13336026132454853 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0, vuPostFader: 0 },
          { vuPost: 0.45842589830313557, vuPostFader: 0.3500706859769399 },
          { vuPost: 0.4500908819703513, vuPostFader: 0.34173566964415564 },
        ],
        master: [
          { vuPost: 0.7334814372850169, vuPostFader: 0.7168114046194484 },
          { vuPost: 0.7251464209522327, vuPostFader: 0.708476388286664 },
        ],
        line: [
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
          { vuPre: 0, vuPost: 0, vuPostFader: 0 },
        ],
      });
    });
  });
});
