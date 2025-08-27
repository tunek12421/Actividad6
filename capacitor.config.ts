import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tunek.booksapp',
  appName: 'Books App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'books.google.com',
      'books.googleusercontent.com',
      '*.googleapis.com',
      '*.googleusercontent.com'
    ]
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
