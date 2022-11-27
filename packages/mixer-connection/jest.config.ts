/* eslint-disable */
export default {
  displayName: 'mixer-connection',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/mixer-connection',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
