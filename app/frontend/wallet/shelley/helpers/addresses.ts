import * as lib from '@emurgo/js-chain-libs'
import bech32 from './bech32'
import {deriveBaseAddress} from 'cardano-crypto.js'
const {Address, Account, AddressDiscrimination, PublicKey, AddressKind} = lib

const getDiscriminator = (network) => {
  const discriminator = {
    mainnet: AddressDiscrimination.Production,
    testnet: AddressDiscrimination.Test,
  }[network.addressDiscriminator]
  if (discriminator == null) throw new Error('Unknown address discriminator')
  return discriminator
}

const xpub2pub = (xpub: Buffer) => xpub.slice(0, 32)

interface Network {
  addressDiscriminator: 'mainnet' | 'testnet'
}

type Xpub = Buffer

export const bechAddressToHex = (address: string) => {
  const parsed = bech32.decode(address)
  if (parsed.prefix !== 'addr') throw Error('Invalid address')
  return parsed.data.toString('hex')
}

export const groupToSingle = (address: string) => {
  // Taken from https://github.com/Emurgo/yoroi-frontend/blob/461e94c3dfd364eb81b10652c66f9c3c403787a6/app/api/ada/lib/storage/bridge/utils.js
  const wasmAddr = Address.from_bytes(Buffer.from(address, 'hex'))
  const wasmGroupAddr = wasmAddr.to_group_address()
  if (wasmGroupAddr == null) {
    throw new Error(`groupToSingle not a group address ${address}`)
  }
  const singleWasm = Address.single_from_public_key(
    wasmGroupAddr.get_spending_key(),
    wasmAddr.get_discrimination()
  )
  const asString = Buffer.from(singleWasm.as_bytes()).toString('hex')

  return asString
}

export const accountAddressFromXpub = (stakeXpub: Xpub, network: Network) => {
  const _addr = Account.single_from_public_key(
    PublicKey.from_bytes(xpub2pub(stakeXpub))
  ).to_address(getDiscriminator(network))

  return _addr.to_string('addr')
}

export const singleAddressFromXpub = (spendXpub: Xpub, network: Network) => {
  const _addr = Address.single_from_public_key(
    PublicKey.from_bytes(xpub2pub(spendXpub)),
    getDiscriminator(network)
  )
  return _addr.to_string('addr')
}

export const groupAddressFromXpub = (spendXpub: Xpub, stakeXpub: Xpub, network: Network) => {
  const _addr = Address.delegation_from_public_key(
    PublicKey.from_bytes(xpub2pub(spendXpub)),
    PublicKey.from_bytes(xpub2pub(stakeXpub)),
    getDiscriminator(network)
  )
  return _addr.to_string('addr')
}

export const baseAddressFromXpub = (spendXpub: Xpub, stakeXpub: Xpub, account, networkId) => {
  const addrBuffer = deriveBaseAddress(
    spendXpub.slice(0, 32),
    stakeXpub.slice(0, 32),
    account,
    networkId
  )
  return bech32.encode({prefix: 'addr', data: addrBuffer})
}

const getAddressKind = (address: string) => {
  // separate get_kind method since chain-libs throw error with legacy
  // addresses TODO: refactor
  try {
    const wasmAddr = address.startsWith('addr1')
      ? Address.from_string(address)
      : Address.from_bytes(Buffer.from(address, 'hex'))
    return wasmAddr.get_kind()
  } catch (e) {
    return undefined
  }
}

export const isShelleyAddress = (address: string): boolean => {
  if (!address.startsWith('addr1')) return false
  const addressKind = getAddressKind(address)
  return (
    addressKind === AddressKind.Group ||
    addressKind === AddressKind.Single ||
    addressKind === AddressKind.Account
  )
}

export const isGroup = (address: string): boolean => {
  return getAddressKind(address) === AddressKind.Group
}

export const isSingle = (address: string): boolean => {
  return getAddressKind(address) === AddressKind.Single
}
