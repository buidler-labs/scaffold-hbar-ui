# @scaffold-hbar-ui/hooks

A collection of React hooks for managing UI state.

## Installation

```bash
npm install @scaffold-hbar-ui/hooks
# or
yarn add @scaffold-hbar-ui/hooks
```

## Hooks

### useAddress

Formats EVM addresses (checksum, short form), block explorer URL (HashScan on Hedera), and blockie URL.

```tsx
import { useAddress } from "@scaffold-hbar-ui/hooks";
import { hederaTestnet } from "viem/chains";
import { useAccount } from "wagmi";

function AddressInfo() {
  const { address } = useAccount();

  const { checkSumAddress, blockExplorerAddressLink, isValidAddress, shortAddress, blockieUrl } = useAddress({
    address,
    chain: hederaTestnet,
  });

  return (
    <div>
      {blockieUrl ? (
        <img
          src={blockieUrl}
          alt=""
          width={32}
          height={32}
        />
      ) : null}
      <div>Address: {checkSumAddress}</div>
      <div>Short: {shortAddress}</div>
      <a
        href={blockExplorerAddressLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on explorer
      </a>
      {isValidAddress ? <div>Valid</div> : null}
    </div>
  );
}
```

## Hedera

**Balance and native price:** When you use `useBalance` or the `Balance` component with a Hedera chain (e.g. `hederaTestnet`), the USD price is sourced from HBAR (CoinGecko). No configuration is required.

### Mirror node resolution

All Hedera account resolution (EVM ↔ account ID) calls the **Hedera mirror node directly**.

The mirror base URL is chosen from the **network** implied by each hook’s `chainId` (via `chainIdToHederaNetwork`):

- **mainnet** (chain `295`) → `https://mainnet.mirrornode.hedera.com`
- **testnet** (chain `296`) and **local** (`31337`) → `https://testnet.mirrornode.hedera.com`

### useHederaAccountId

Resolves a Hedera account ID (e.g. `0.0.8041897`) for an EVM address. Used by components like `HederaAddress`.

```tsx
import { useHederaAccountId } from "@scaffold-hbar-ui/hooks";

const { accountId, status, isLoading } = useHederaAccountId(evmAddress, chainId);
```

### useHederaEvmAddress

Resolves an EVM address (`0x…`) for a Hedera native account ID. Used by components like `HederaAddress`.

```tsx
import { useHederaEvmAddress } from "@scaffold-hbar-ui/hooks";

const { evmAddress, status, isLoading } = useHederaEvmAddress(accountId, chainId);
```

### useHederaAddressInput

Validates and resolves Hedera address input as native **`0.0.n`** or EVM **`0x…`**. Exposes a checksummed `evmAddress` when valid, plus errors, warnings, and loading flags. The `HederaAddressInput` component is built on this hook.

```tsx
import { useHederaAddressInput } from "@scaffold-hbar-ui/hooks";

const { evmAddress, error, warning, isResolving, accountIdFromEvm } = useHederaAddressInput({
  value: inputValue,
  chainId: 296,
  debounceDelay: 400,
});
```

## License

MIT
