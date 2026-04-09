import { fetchMirrorAccount, resolveEvmAddress } from "./mirrorNode";

export type HederaNetwork = "testnet" | "mainnet";

const CHAIN_ID_TO_NETWORK: Record<number, HederaNetwork> = {
  295: "mainnet",
  296: "testnet",
};

/** Set of Hedera chain IDs (mainnet and testnet). Use for native price and explorer link logic. */
export const HEDERA_CHAIN_IDS: ReadonlySet<number> = new Set(Object.keys(CHAIN_ID_TO_NETWORK).map(Number));

/** Maps a viem/wagmi chain ID to "testnet" | "mainnet". Defaults to "testnet". */
export function chainIdToHederaNetwork(chainId: number): HederaNetwork {
  return CHAIN_ID_TO_NETWORK[chainId] ?? "testnet";
}

/**
 * Returns the Hedera account ID (e.g. "0.0.8041897") for an EVM address
 * by querying the Hedera mirror node directly.
 *
 * @param evmAddress - EVM address (0x...)
 * @param network - "testnet" (default) or "mainnet"
 * @param options - Optional `signal` for cancellation
 * @returns Hedera account ID or null if not found
 */
export async function getHederaAccountId(
  evmAddress: string,
  network: HederaNetwork = "testnet",
  options?: { signal?: AbortSignal },
): Promise<string | null> {
  const data = await fetchMirrorAccount(evmAddress, network, options?.signal);
  return data?.accountId ?? null;
}

/**
 * Returns the EVM address (0x...) for a Hedera account ID, or null if the
 * account has no EVM alias (e.g. ED25519-only).
 * Queries the Hedera mirror node directly.
 *
 * @param accountId - Hedera account ID (e.g. "0.0.12345")
 * @param network - "testnet" (default) or "mainnet"
 * @param options - Optional `signal` for cancellation
 * @returns EVM address or null
 */
export async function getEvmAddressFromHederaAccountId(
  accountId: string,
  network: HederaNetwork = "testnet",
  options?: { signal?: AbortSignal },
): Promise<string | null> {
  const data = await fetchMirrorAccount(accountId, network, options?.signal);
  if (!data) return null;
  return resolveEvmAddress(data);
}
