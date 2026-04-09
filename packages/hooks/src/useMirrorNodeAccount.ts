import { useQuery } from "@tanstack/react-query";
import type { HederaNetwork } from "./hederaUtils";
import { chainIdToHederaNetwork } from "./hederaUtils";
import { fetchMirrorAccount, resolveEvmAddress, type HederaKeyType } from "./mirrorNode";

export type { HederaKeyType } from "./mirrorNode";

/**
 * Full account data from a single mirror-node call.
 * Use this as the single source of truth for identity, key type, and balance.
 */
export type HederaAccount = {
  /** Hedera account ID (e.g. "0.0.12345"). Always present. */
  accountId: string;
  /** EVM address (0x...) if the account has an alias; null for ED25519-only. */
  evmAddress: string | null;
  /** Account's public key type. */
  keyType: HederaKeyType;
  /** Balance in tinybars (8 decimals). */
  balance: bigint;
  /** True when the account has an EVM alias (evmAddress !== null). */
  canSignEVM: boolean;
};

const STALE_TIME_MS = 30_000;
const GC_TIME_MS = 5 * 60_000;

async function fetchAccount(
  input: string,
  network: HederaNetwork,
  signal?: AbortSignal,
): Promise<HederaAccount | null> {
  const data = await fetchMirrorAccount(input, network, signal);
  if (!data) return null;
  const evmAddress = resolveEvmAddress(data);

  return {
    accountId: data.accountId,
    evmAddress,
    keyType: data.keyType,
    balance: data.balanceTinybars,
    canSignEVM: evmAddress !== null,
  };
}

export type UseMirrorNodeAccountOptions = {
  /** Override network (default from chainId or "testnet"). */
  network?: HederaNetwork;
  /** Chain ID to derive network from (296 = testnet, 295 = mainnet). */
  chainId?: number;
};

/**
 * Single source of truth for Hedera account data from the mirror node.
 * Accepts either an EVM address (0x...) or a native account ID (0.0.XXXXX).
 * Cached with React Query so multiple components sharing the same input reuse one request.
 *
 * @param input - EVM address or Hedera account ID, or undefined to skip the request
 * @param options - Optional network or chainId
 * @returns { data, isLoading, isError, refetch } -- data is HederaAccount | null when resolved
 */
export function useMirrorNodeAccount(
  input: string | undefined,
  options: UseMirrorNodeAccountOptions = {},
): {
  data: HederaAccount | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const { network, chainId } = options;
  const normalizedInput = typeof input === "string" ? input.trim() : "";
  const effectiveNetwork = network ?? chainIdToHederaNetwork(chainId ?? 296);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mirrorNode", "account", normalizedInput, effectiveNetwork],
    queryFn: ({ signal }) => fetchAccount(normalizedInput, effectiveNetwork, signal),
    enabled: normalizedInput.length > 0,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    refetch,
  };
}
