import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { checker } from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

import * as fs from 'fs'
import * as path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    
    return {
    server: {
        port: Number(env.VITE_PORT),
      },
    plugins: [
        react(),
        tsconfigPaths(),
        checker({
            overlay: {
                initialIsOpen: false,
            },
            typescript: true,
        })
    ],
    build: {
        sourcemap: true,
    },
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
        dedupe: ['react'],
        alias: {
            '@api': `${root}/api`,
            '@': `${root}/`,
            '@config': `${root}/config.ts`,
            '@branding': `${root}/../static/branding`,
            '@styles': `${root}/styles`
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @import "@styles/_animations.scss";
                @import "@styles/_functions.scss";
                @import "@styles/_placeholders.scss";
                @import "@styles/_mixins.scss";
                `,
            }
        }
    }
}})
