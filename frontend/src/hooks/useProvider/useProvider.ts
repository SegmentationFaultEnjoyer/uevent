import { ethers } from 'ethers'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import {
  coinbaseWrapper,
  metamaskWrapper,
} from '@/hooks/useProvider'
import {
  ChainId,
  DesignatedProvider,
  ProviderWrapper,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { NativeCurrency } from '@/helpers'

export interface UseProvider {
  currentProvider?: ethers.providers.Web3Provider
  currentSigner?: ethers.providers.JsonRpcSigner

  init: (provider: DesignatedProvider) => Promise<void>
  disconnect: () => void
  chainId: ChainId
  selectedAddress: string
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
    nativeCurrency: NativeCurrency,
    blockExplorerUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  isConnected: boolean
  selectedProvider: string | undefined
  connect: () => Promise<void>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
}

export const useProvider = (): UseProvider => {
  const [providerWrp, setProviderWrp] = useState<ProviderWrapper | undefined>()

  const currentProvider = useMemo(
    () => providerWrp?.currentProvider,
    [providerWrp],
  )

  const currentSigner = useMemo(
    () => providerWrp?.currentSigner,
    [providerWrp]
  )

  const [selectedProvider, setSelectedProvider] = useState<string | undefined>()

  const [chainId, setChainId] = useState<ChainId>('')
  const [selectedAddress, setSelectedAddress] = useState('')

  const isConnected = useMemo(
    () => Boolean(chainId && selectedAddress),
    [chainId, selectedAddress],
  )

  const init = useCallback(
    async (provider: DesignatedProvider) => {
      switch (provider.name as PROVIDERS) {
        case PROVIDERS.metamask:
          setProviderWrp(state => {
            const newState = metamaskWrapper(provider.instance, {
              selectedAddressState: [selectedAddress, setSelectedAddress],
              chainIdState: [chainId, setChainId],
            })

            return isEqual(state, newState) ? state : newState
          })
          break
        case PROVIDERS.coinbase:
          setProviderWrp(state => {
            const newState = coinbaseWrapper(provider.instance, {
              selectedAddressState: [selectedAddress, setSelectedAddress],
              chainIdState: [chainId, setChainId],
            })

            return isEqual(state, newState) ? state : newState
          })
          break
        default:
          throw new Error('Invalid Provider')
      }
      setSelectedProvider(provider.name)
    },
    [chainId, selectedAddress],
  )

  useEffect(() => {
    providerWrp?.init()
  }, [providerWrp])

  const connect = useCallback(async () => {
    if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

    await providerWrp.connect()
  }, [providerWrp])

  const switchChain = useCallback(
    async (chainId: ChainId) => {
      if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

      await providerWrp.switchChain(chainId)
    },
    [providerWrp],
  )

  const addChain = useCallback(
    async (
      chainId: ChainId,
      chainName: string,
      chainRpcUrl: string,
      nativeCurrency: NativeCurrency,
      blockExplorerUrl: string,) => {
      if (!providerWrp || !providerWrp?.addChain)
        throw new errors.ProviderWrapperMethodNotFoundError()

      await providerWrp.addChain(chainId, chainName, chainRpcUrl, nativeCurrency, blockExplorerUrl)
    },
    [providerWrp],
  )

  const disconnect = useCallback(() => {
    setProviderWrp(undefined)
    setProviderWrp(undefined)
    setSelectedProvider(undefined)
    setChainId('')
    setSelectedAddress('')
  }, [])

  const signAndSendTx = useCallback(
    (txRequestBody: TxRequestBody) => {
      if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

      return providerWrp.signAndSendTransaction(txRequestBody)
    },
    [providerWrp],
  )

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.getHashFromTxResponse(txResponse)
  }

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.getTxUrl(explorerUrl, txHash)
  }

  const getAddressUrl = (explorerUrl: string, address: string) => {
    if (!providerWrp) throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.getAddressUrl(explorerUrl, address)
  }

  return {
    currentProvider,
    currentSigner,

    selectedProvider,
    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    switchChain,
    addChain,
    disconnect,
    signAndSendTx,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
  }
}
