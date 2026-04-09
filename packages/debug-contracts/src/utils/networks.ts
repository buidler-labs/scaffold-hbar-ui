import * as chains from "viem/chains";

function hashscanBaseUrlForChainId(chainId: number): string {
  if (chainId === chains.hedera.id) return "https://hashscan.io/mainnet";
  if (chainId === chains.hederaTestnet.id) return "https://hashscan.io/testnet";
  return "https://hashscan.io/testnet";
}

function isHederaChainId(chainId: number): boolean {
  return chainId === chains.hedera.id || chainId === chains.hederaTestnet.id;
}

/**
 * Gives the block explorer URL for a given address.
 * Hedera chains use HashScan with `/account/`; EVM explorers use `/address/`.
 * If no explorer is configured on the chain, falls back to HashScan (mainnet / testnet by id, else testnet).
 */
export function getBlockExplorerAddressLink(network: chains.Chain, address: string) {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `${hashscanBaseUrlForChainId(network.id)}/account/${address}`;
  }

  const pathSegment = isHederaChainId(network.id) ? "account" : "address";
  return `${blockExplorerBaseURL}/${pathSegment}/${address}`;
}
