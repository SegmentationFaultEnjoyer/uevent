import { mapKeys, pickBy } from 'lodash-es'

import packageJson from '../package.json'

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  EVENT_FACTORY_ADDRESS: import.meta.env.VITE_EVENT_FACTORY_ADDRESS,
  EVENT_FACTORY_CHAIN_ID: import.meta.env.VITE_FACTORY_CHAIN_ID,
  INFURA_API_KEY: import.meta.env.VITE_INFURA_KEY,
  INFURA_PROJECT_ID: import.meta.env.VITE_INFURA_PROJECT_ID,
  IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  FACTORY_CHAIN_NAME: import.meta.env.VITE_FACTORY_CHAIN_NAME,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(window.document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
