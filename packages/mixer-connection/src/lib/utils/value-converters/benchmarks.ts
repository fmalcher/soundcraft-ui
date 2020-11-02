/**
 * Those are helper functions and utilities that have been used to generate and test the dB / linear LUT.
 * They are not needed in production, but just if you want to re-generate and evaluate the LUT.
 */

import {
  DBToFaderValue,
  DBToFaderValueCALC,
  faderValueToDB,
  faderValueToDBCALC,
} from './value-converters';

function generateLUT() {
  const dbValues = [];

  const fractionFactor = 100000000000;

  for (let i = -1000; i <= -300; i += 10) {
    dbValues.push(i / 10);
  }
  for (let i = -299; i <= 100; i += 1) {
    dbValues.push(i / 10);
  }

  const results = dbValues.map(dbval => [
    dbval,
    Math.round(DBToFaderValueCALC(dbval) * fractionFactor) / fractionFactor,
  ]);

  console.log(JSON.stringify(results));
}

function checkPrecision() {
  const results: (string | number)[][] = [['CALC', 'LUT', 'DIFF']];

  [0.9876543, 0.00345, 0.5672, 0.76343, 0.345679].forEach(v => {
    const calc = faderValueToDBCALC(v);
    const lut = faderValueToDB(v);
    results.push([calc, lut, calc - lut]);
  });

  [6, -12, -23.5, -98.3, -50.5, 3.5].forEach(v => {
    const calc = DBToFaderValueCALC(v);
    const lut = DBToFaderValue(v);
    results.push([calc, lut, calc - lut]);
  });

  console.table(results);
}

function benchmark() {
  const count = 10000000;
  const sourceDBValues = [];
  for (let i = 0; i < count; i++) {
    sourceDBValues.push(Math.random() * 110 - 100);
  }

  console.log(`Running with ${count} source values ...`);

  console.time('LUT');
  const resultsLUT = sourceDBValues.map(dbVal => DBToFaderValue(dbVal));
  console.timeEnd('LUT');

  console.time('CALC');
  const resultsCalc = sourceDBValues.map(dbVal => DBToFaderValueCALC(dbVal));
  console.timeEnd('CALC');
}
