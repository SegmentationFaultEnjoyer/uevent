import { ethers } from 'ethers'

import { EIP1193, EIP1193String, EIP1474, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { errors } from '@/errors'
import { EthProviderRpcError, UseProvider } from '@/types'
import { ErrorHandler } from './error-handler'
import { ChainInfo, POLYGON_MAINNET_CHAIN, POLYGON_MUMBAI_CHAIN, Q_MAINNET_CHAIN, Q_TESTNET_CHAIN } from '@/consts'

export type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
}

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  await provider.send('eth_requestAccounts', [])
}

export async function requestSwitchEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
) {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ])
}

export async function requestAddEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
  nativeCurrency: NativeCurrency,
  blockExplorerUrl: string,
) {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
      nativeCurrency,
      blockExplorerUrls: [blockExplorerUrl],
    },
  ])
}

export function handleEthError(error: EthProviderRpcError) {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
    case EIP1193String.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.parseError:
      throw new errors.ProviderParseError()
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.internalError:
      throw new errors.ProviderInternalError()
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}

function getChainById(id: string): ChainInfo {
  switch (id) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case POLYGON_CHAINS.mainnet:
      return POLYGON_MAINNET_CHAIN
    case Q_CHAINS.mainet:
      return Q_MAINNET_CHAIN
    case Q_CHAINS.testnet:
    default:
      return Q_TESTNET_CHAIN
  }
}

export async function switchChain(chainId: string, provider: UseProvider) {
  try {
    await provider.switchChain(chainId)
  } catch (error) {
    const ethError = error as EthProviderRpcError

    if (ethError.code === EIP1193.walletMissingChain) {
      const chain = getChainById(chainId)
      await provider.addChain(
        chainId,
        chain.name,
        chain.rpcUrl,
        chain.nativeCurrency,
        chain.blockExplorerUrl,
      )
    }

    ErrorHandler.processWithoutFeedback(error)
  }
}
