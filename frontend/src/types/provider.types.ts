import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { PROVIDERS } from '@/enums'
import { EthereumProvider, PhantomProvider } from '@/types'
import { NativeCurrency } from '@/helpers'

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | PhantomProvider | unknown

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS
  instance: ProviderInstance
}

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string
  | unknown

export type EthTransactionResponse = ethers.providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | unknown

/**
 * composable object of designated provider,
 * which we can use to solve user needs
 */
export interface ProviderWrapper {
  currentProvider?: ethers.providers.Web3Provider
  currentSigner?: ethers.providers.JsonRpcSigner

  init: () => Promise<void>
  connect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  addChain?: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
    nativeCurrency: NativeCurrency,
    blockExplorerUrl: string,
  ) => Promise<void>
  signAndSendTransaction: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  disconnect?: () => Promise<void>
  signMessage?: (message: string) => Promise<string | undefined>
}

export type { UseProvider } from '@/hooks/useProvider'
