/* eslint-disable */
export default {
  displayName: 'mixer-connection',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/mixer-connection',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
