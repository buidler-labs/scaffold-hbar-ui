const HEDERA_PORTAL_FAUCET = "https://portal.hedera.com/faucet";

/** Hedera Portal faucet; pre-fills `address` when an EVM address is provided. */
export const hederaPortalFaucetUrl = (evmAddress?: string | null) => {
  if (!evmAddress) return HEDERA_PORTAL_FAUCET;
  const url = new URL(HEDERA_PORTAL_FAUCET);
  url.searchParams.set("address", evmAddress);
  return url.toString();
};
