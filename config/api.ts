import { Platform } from 'react-native';

const API_PORT = 5000;

/**
 * Android emulator cannot reach the host machine via localhost.
 * It must use 10.0.2.2, which maps to the host loopback interface.
 * Web and iOS can call localhost directly.
 *
 * Override for a physical device or remote server:
 *   EXPO_PUBLIC_API_URL=http://192.168.0.203:5000
 */
function resolveApiBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) {
    return override.replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();
