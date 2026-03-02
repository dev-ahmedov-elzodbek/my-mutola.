import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Fix CJS named-export interop for react-redux -> use-sync-external-store/with-selector
  // (avoids: "does not provide an export named 'useSyncExternalStoreWithSelector'")
  optimizeDeps: {
    include: [
      'react-redux',
      'use-sync-external-store',
      'use-sync-external-store/with-selector',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
