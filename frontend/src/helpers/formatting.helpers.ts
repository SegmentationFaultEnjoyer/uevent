import getSymbolFromCurrency from 'currency-symbol-map'
import { BN, BnLike } from '@/utils/math.util'
import { config } from '@/config'

export function cropAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-5)}`
}

function _formatMoney(formattedAmount: string, currency = '') {
  const symbol = getSymbolFromCurrency(currency)
  return symbol
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount} ${currency}`
}

export function formatFiatAsset(amount: BnLike, currency = '') {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatFiatAssetFromWei(amount: BnLike, currency = '') {
  const formattedAmount = new BN(amount).fromWei().format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatAssetFromWei(
  amount: BnLike,
  decimals: number,
  currency = '',
) {
  const formattedAmount = new BN(amount).fromWei().format({ decimals })

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export function formatNumber(amount: BnLike) {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return formattedAmount
}

export async function fileToFormData(file: File, name = 'Document'): Promise<FormData> {
  const arrayBuffer = await file.arrayBuffer()

  if (!arrayBuffer) throw new Error('No array buffer')

  const blob = new Blob([new Uint8Array(arrayBuffer)], {
    type: file.type,
  })

  const formData = new FormData()
  formData.append(name, blob)

  return formData
}

export function formatIPFSLink(fileHash: string) {
  return `${config.IPFS_GATEWAY}${fileHash}`
}

export function getShortAddress(rawValue: google.maps.GeocoderAddressComponent[]) {
  return `${rawValue[6].long_name} ${rawValue[5].long_name} ${rawValue[3].long_name}`
}