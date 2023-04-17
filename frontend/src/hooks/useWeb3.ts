import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PROVIDERS, PROVIDERS_CHECKS } from '@/enums'
import { sleep } from '@/helpers'
import { DesignatedProvider, ProviderInstance } from '@/types'

export const useWeb3 = () => {
  const [providers, setProviders] = useState<DesignatedProvider[]>([])

  const [_browserProviders, _setBrowserProviders] = useState<
    ProviderInstance[]
  >([])

  const isEnabled = useMemo(() => providers.length, [providers])

  const init = async () => {
    await sleep(500)
    detectProvidersInBrowser()
  }

  const detectProvidersInBrowser = useCallback(() => {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined
    const phantomProvider = window?.solana
    const solflareProvider = window?.solflare

    _setBrowserProviders(state => {
      const newState = [
        ...(ethProviders ? ethProviders : []),
        ...(phantomProvider ? [phantomProvider] : []),
        ...(solflareProvider ? [solflareProvider] : []),
      ]

      return isEqual(state, newState) ? state : newState
    })
  }, [])

  const getAppropriateProviderName = useCallback(
    (provider: ProviderInstance): PROVIDERS => {
      const providerName = Object.entries(PROVIDERS_CHECKS).find(el => {
        const [, value] = el

        return ((<unknown>provider) as { [key in PROVIDERS_CHECKS]: boolean })[
          value
        ]
      })

      return (
        ((providerName && providerName[0]) as PROVIDERS) || PROVIDERS.fallback
      )
    },
    [],
  )

  const designateBrowserProviders = useCallback((): DesignatedProvider[] => {
    if (!_browserProviders.length) return []

    const designatedProviders = _browserProviders.map(el => {
      const appropriatedProviderName: PROVIDERS = getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        instance: el,
      } as DesignatedProvider
    })

    return designatedProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    )
  }, [_browserProviders, getAppropriateProviderName])

  const _defineProviders = useCallback(async () => {
    if (_browserProviders.length) {
      await handleProviders()
    } else {
      await sleep(3000)
      await handleProviders()
    }

    async function handleProviders() {
      if (!_browserProviders.length) return
      setProviders(state => {
        const newState = designateBrowserProviders()

        return isEqual(newState, state) ? state : newState
      })
    }
  }, [_browserProviders.length, designateBrowserProviders])

  useEffect(() => {
    _defineProviders()
  }, [_browserProviders, _defineProviders])

  return {
    providers,

    isEnabled,

    init,
  }
}
