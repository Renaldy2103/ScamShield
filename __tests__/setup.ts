// Mock for @react-native-async-storage/async-storage
const memoryStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key: string, value: string) => {
    memoryStorage[key] = value;
    return null;
  }),
  getItem: jest.fn(async (key: string) => {
    return memoryStorage[key] || null;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete memoryStorage[key];
    return null;
  }),
  clear: jest.fn(async () => {
    Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);
    return null;
  }),
  getAllKeys: jest.fn(async () => Object.keys(memoryStorage)),
}));

// Mock react-native modules if needed
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios },
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
    hairlineWidth: 1,
  },
  Alert: { alert: jest.fn() },
  Share: { share: jest.fn() },
  Linking: { openURL: jest.fn() },
}));
