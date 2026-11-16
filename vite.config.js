import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { cp, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'

const strokeDataDirectory = resolve('node_modules/hanzi-writer-data')

function localStrokeData() {
  return {
    name: 'local-stroke-data',
    configureServer(server) {
      server.middlewares.use('/strokes', async (request, response, next) => {
        let filename
        try {
          filename = decodeURIComponent((request.url || '').split('?')[0].replace(/^\//, ''))
        } catch {
          return next()
        }
        if (!/^\p{Script=Han}\.json$/u.test(filename)) return next()
        try {
          const data = await readFile(join(strokeDataDirectory, filename))
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(data)
        } catch {
          next()
        }
      })
    },
    async writeBundle(options) {
      await cp(strokeDataDirectory, join(resolve(options.dir || 'dist'), 'strokes'), {
        recursive: true,
        filter: (source) => source === strokeDataDirectory || source.endsWith('.json') || source.endsWith('ARPHICPL.TXT'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localStrokeData()],
})
