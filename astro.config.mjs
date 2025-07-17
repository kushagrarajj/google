import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    optimizeDeps: {
      include: ['three', 'gsap', 'matter-js', 'howler']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
            vendor: ['matter-js', 'howler', 'lenis']
          }
        }
      }
    }
  }
});