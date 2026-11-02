import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Beri versi unik pada cache service worker di setiap build
function serviceWorkerVersion() {
  let outDir
  return {
    name: 'service-worker-version',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const file = resolve(outDir, 'sw.js')
      const source = await readFile(file, 'utf8')
      await writeFile(file, source.replaceAll('__BUILD_ID__', Date.now().toString(36)))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), serviceWorkerVersion()],
})
