# @scaffold-hbar-ui/debug-contracts

## 2.0.0

### Minor Changes

- Improve Hedera account resolution and align network handling across scaffold-hbar-ui packages.

  In `@scaffold-hbar-ui/hooks`, account and EVM-address resolution now use Hedera mirror nodes directly for mainnet/testnet, with updated utilities and exports to simplify integration and improve consistency. Hook behavior and docs were updated to reflect the mirror-node-first flow.

  In `@scaffold-hbar-ui/debug-contracts`, transaction explorer URL generation now reuses shared hook utilities, and Hedera-specific input behavior was narrowed to supported Hedera chain IDs (mainnet/testnet) for clearer network handling.

  In `@scaffold-hbar-ui/components`, `HederaAddress` received import/style cleanup with no functional API changes.

### Patch Changes

- Updated dependencies
  - @scaffold-hbar-ui/hooks@1.1.0
  - @scaffold-hbar-ui/components@2.0.0

## 0.1.7

### Patch Changes

- f91079a: expose contract inputs
- 5b6f98e: up react and next
- Updated dependencies [5b6f98e]
  - @scaffold-hbar-ui/components@0.1.8
  - @scaffold-hbar-ui/hooks@0.1.6

## 0.1.6

### Patch Changes

- Updated dependencies [20f846e]
  - @scaffold-hbar-ui/components@0.1.7

## 0.1.5

### Patch Changes

- 5a3a506: update peerDeps
- Updated dependencies [d9590fe]
- Updated dependencies [5a3a506]
- Updated dependencies [6582fcd]
  - @scaffold-hbar-ui/components@0.1.6
  - @scaffold-hbar-ui/hooks@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [5e23fdf]
  - @scaffold-hbar-ui/hooks@0.1.4
  - @scaffold-hbar-ui/components@0.1.5

## 0.1.3

### Patch Changes

- Updated dependencies [c805b7e]
  - @scaffold-hbar-ui/hooks@0.1.3
  - @scaffold-hbar-ui/components@0.1.4

## 0.1.2

### Patch Changes

- d2504c6: (debug-contracts): make the hardhat/anvil chain name neutral
- Updated dependencies [d2504c6]
  - @scaffold-hbar-ui/components@0.1.3

## 0.1.1

### Patch Changes

- b884a95: Intial version
- b884a95: use react context for chainId, chain and blockExplorerAddress to avoid prop drilling
- b884a95: ui polish to debug component
- b884a95: UI polish
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
  - @scaffold-hbar-ui/components@0.1.2
  - @scaffold-hbar-ui/hooks@0.1.2

## 0.1.1-rc.4

### Patch Changes

- 8a1385f: use react context for chainId, chain and blockExplorerAddress to avoid prop drilling
- Updated dependencies [8a1385f]
  - @scaffold-hbar-ui/components@0.1.2-rc.5

## 0.1.1-rc.3

### Patch Changes

- 5e5778b: ui polish to debug component
- Updated dependencies [5e5778b]
- Updated dependencies [5e5778b]
- Updated dependencies [5e5778b]
  - @scaffold-hbar-ui/components@0.1.2-rc.4
  - @scaffold-hbar-ui/hooks@0.1.2-rc.1

## 0.1.1-rc.2

### Patch Changes

- bd0d241: UI polish
- Updated dependencies [bd0d241]
  - @scaffold-hbar-ui/components@0.1.2-rc.3

## 0.1.1-rc.1

### Patch Changes

- Updated dependencies [211c108]
  - @scaffold-hbar-ui/components@0.1.2-rc.2

## 0.1.1-rc.0

### Patch Changes

- 58922df: Intial version
- Updated dependencies [b3da6fe]
  - @scaffold-hbar-ui/components@0.1.2-rc.1
