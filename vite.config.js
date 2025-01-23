import eslint from 'vite-plugin-eslint';
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
// eslint-disable-next-line new-cap
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    eslint(),
    // eslint-disable-next-line new-cap
    VitePWA(),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});
