import { POLYGON_CHAINS, Q_CHAINS } from "@/enums"
import { NativeCurrency } from "@/helpers"

export type ChainInfo = {
    name: string,
    nativeCurrency: NativeCurrency
    rpcUrl: string
    blockExplorerUrl: string
    chainId: string
}

export const POLYGON_MUMBAI_CHAIN: ChainInfo = {
    name: 'Mumbai',
    nativeCurrency: {
        symbol: 'MATIC',
        name: 'MATIC',
        decimals: 18,
    },
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    chainId: POLYGON_CHAINS.mumbai,
}

export const POLYGON_MAINNET_CHAIN: ChainInfo = {
    name: 'Polygon Mainnet',
    nativeCurrency: {
        symbol: 'MATIC',
        name: 'MATIC',
        decimals: 18,
    },
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com/',
    chainId: POLYGON_CHAINS.mainnet
}

export const Q_TESTNET_CHAIN: ChainInfo = {
    name: 'Q Testnet',
    nativeCurrency: {
        symbol: 'Q ',
        name: 'Q',
        decimals: 18,
    },
    rpcUrl: 'https://rpc.qtestnet.org',
    blockExplorerUrl: 'https://explorer.qtestnet.org/',
    chainId: Q_CHAINS.testnet,
}

export const Q_MAINNET_CHAIN: ChainInfo = {
    name: 'Q Mainnet',
    nativeCurrency: {
        symbol: 'Q ',
        name: 'Q',
        decimals: 18,
    },
    rpcUrl: 'https://rpc.q.org',
    blockExplorerUrl: 'https://explorer.q.org/',
    chainId: Q_CHAINS.mainet,
}
