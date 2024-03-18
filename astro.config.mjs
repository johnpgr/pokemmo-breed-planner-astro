import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind()],
    vite: {
        plugins: [tsconfigPaths()],
    },
})
