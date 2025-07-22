// Mock for react-native-reanimated
export default {
  Value: jest.fn(() => ({
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    stopAnimation: jest.fn(),
    resetAnimation: jest.fn(),
  })),
  event: jest.fn(() => jest.fn()),
  add: jest.fn(),
  eq: jest.fn(),
  set: jest.fn(),
  cond: jest.fn(),
  interpolate: jest.fn(),
  View: 'View',
  Extrapolate: { CLAMP: jest.fn() },
  Transition: {
    Together: 'Together',
    Out: 'Out',
    In: 'In',
  },
  Easing: {
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
  runOnJS: jest.fn(),
  runOnUI: jest.fn(),
};