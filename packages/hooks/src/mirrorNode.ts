import type { HederaNetwork } from "./hederaUtils";

/** Partial shape of Hedera mirror node `GET /api/v1/accounts/{id}` JSON. */
type MirrorNodeAccountJson = {
  account?: string;
  evm_address?: string | null;
  alias?: string;
  key?: { _type?: string } | null;
  balance?: { balance?: number };
};

export type HederaKeyType = "ED25519" | "ECDSA_SECP256K1";

/** Normalized account data returned by `fetchMirrorAccount`. */
export type MirrorAccountData = {
  accountId: string;
  evmAddress: string | null;
  alias: string | null;
  keyType: HederaKeyType;
  balanceTinybars: bigint;
};

/**
 * Resolves the best EVM address representation from mirror account data.
 * Prefer `evm_address`, otherwise accept `alias` only when it is 0x-prefixed.
 */
export function resolveEvmAddress(data: Pick<MirrorAccountData, "evmAddress" | "alias">): string | null {
  if (data.evmAddress) return data.evmAddress;
  if (data.alias && data.alias.startsWith("0x")) return data.alias;
  return null;
}

const TESTNET_MIRROR = "https://testnet.mirrornode.hedera.com";
const MAINNET_MIRROR = "https://mainnet.mirrornode.hedera.com";

/** Mirror REST base URL from logical network (derived from `chainId` in hooks). */
function mirrorBaseUrlForNetwork(network: HederaNetwork): string {
  if (network === "mainnet") return MAINNET_MIRROR;
  return TESTNET_MIRROR;
}

function parseMirrorAccount(data: MirrorNodeAccountJson): MirrorAccountData | null {
  const accountId = typeof data.account === "string" ? data.account : null;
  if (!accountId) return null;

  const evmAddress = typeof data.evm_address === "string" && data.evm_address.length > 0 ? data.evm_address : null;

  const alias = typeof data.alias === "string" && data.alias.length > 0 ? data.alias : null;

  const keyType: HederaKeyType = data.key?._type === "ECDSA_SECP256K1" ? "ECDSA_SECP256K1" : "ED25519";

  const rawBalance = data.balance?.balance;
  const balanceTinybars = typeof rawBalance === "number" ? BigInt(rawBalance) : 0n;

  return { accountId, evmAddress, alias, keyType, balanceTinybars };
}

/**
 * Fetch account data directly from the Hedera mirror node REST API.
 * The mirror host is chosen from `network` (`mainnet` vs `testnet`).
 *
 * @param addressOrId - EVM address (`0x...`) or Hedera account ID (`0.0.n`)
 * @param network - Logical network from `chainIdToHederaNetwork(chainId)`
 * @param signal - optional `AbortSignal` for cancellation
 * @returns parsed account data, or `null` if 404
 */
export async function fetchMirrorAccount(
  addressOrId: string,
  network: HederaNetwork,
  signal?: AbortSignal,
): Promise<MirrorAccountData | null> {
  const base = mirrorBaseUrlForNetwork(network);
  const url = `${base}/api/v1/accounts/${encodeURIComponent(addressOrId.trim())}`;

  const res = await fetch(url, { signal });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Mirror node request failed (${res.status})`);
  }

  const json = (await res.json()) as MirrorNodeAccountJson;
  return parseMirrorAccount(json);
}
