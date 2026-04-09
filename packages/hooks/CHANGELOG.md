# @scaffold-hbar-ui/hooks

## 1.1.0

### Minor Changes

- Improve Hedera account resolution and align network handling across scaffold-hbar-ui packages.

  In `@scaffold-hbar-ui/hooks`, account and EVM-address resolution now use Hedera mirror nodes directly for mainnet/testnet, with updated utilities and exports to simplify integration and improve consistency. Hook behavior and docs were updated to reflect the mirror-node-first flow.

  In `@scaffold-hbar-ui/debug-contracts`, transaction explorer URL generation now reuses shared hook utilities, and Hedera-specific input behavior was narrowed to supported Hedera chain IDs (mainnet/testnet) for clearer network handling.

  In `@scaffold-hbar-ui/components`, `HederaAddress` received import/style cleanup with no functional API changes.

## 0.1.6

### Patch Changes

- 5b6f98e: up react and next

## 0.1.5

### Patch Changes

- d9590fe: move usehooks-ts dependency to @scaffol-ui/hooks
- 5a3a506: update peerDeps
- 6582fcd: - EtherInput: Allow numbers directly start with decimal
  - useEtherInput: Expose the error message and isError

## 0.1.4

### Patch Changes

- 5e23fdf: make `chain` optional in useBalance hook. Defaults to mainnet

## 0.1.3

### Patch Changes

- c805b7e: Fixed useAddress bug when address is invalid

## 0.1.2

### Patch Changes

- b884a95: make address optional for useBalance and Balance component
- b884a95: fix: useAddress to only use mainnet for resolving ens

## 0.1.2-rc.1

### Patch Changes

- 5e5778b: make address optional for useBalance and Balance component

## 0.1.2-rc.0

### Patch Changes

- 6674b6e: fix: useAddress to only use mainnet for resolving ens

## 0.1.1

### Patch Changes

- 8f807af: add initial component and hooks
