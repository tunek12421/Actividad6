import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tunek.booksapp',
  appName: 'Books App',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
