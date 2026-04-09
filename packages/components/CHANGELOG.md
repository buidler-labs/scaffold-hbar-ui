# @scaffold-hbar-ui/components

## 2.0.0

### Patch Changes

- Improve Hedera account resolution and align network handling across scaffold-hbar-ui packages.

  In `@scaffold-hbar-ui/hooks`, account and EVM-address resolution now use Hedera mirror nodes directly for mainnet/testnet, with updated utilities and exports to simplify integration and improve consistency. Hook behavior and docs were updated to reflect the mirror-node-first flow.

  In `@scaffold-hbar-ui/debug-contracts`, transaction explorer URL generation now reuses shared hook utilities, and Hedera-specific input behavior was narrowed to supported Hedera chain IDs (mainnet/testnet) for clearer network handling.

  In `@scaffold-hbar-ui/components`, `HederaAddress` received import/style cleanup with no functional API changes.

- Updated dependencies
  - @scaffold-hbar-ui/hooks@1.1.0

## 0.1.8

### Patch Changes

- 5b6f98e: up react and next
- Updated dependencies [5b6f98e]
  - @scaffold-hbar-ui/hooks@0.1.6

## 0.1.7

### Patch Changes

- 20f846e: fallback to wagmi config chain

## 0.1.6

### Patch Changes

- d9590fe: move usehooks-ts dependency to @scaffol-ui/hooks
- 5a3a506: update peerDeps
- 6582fcd: - EtherInput: Allow numbers directly start with decimal
  - useEtherInput: Expose the error message and isError
- Updated dependencies [d9590fe]
- Updated dependencies [5a3a506]
- Updated dependencies [6582fcd]
  - @scaffold-hbar-ui/hooks@0.1.5

## 0.1.5

### Patch Changes

- Updated dependencies [5e23fdf]
  - @scaffold-hbar-ui/hooks@0.1.4

## 0.1.4

### Patch Changes

- Updated dependencies [c805b7e]
  - @scaffold-hbar-ui/hooks@0.1.3

## 0.1.3

### Patch Changes

- d2504c6: set font-family at component level instead of global css rule

## 0.1.2

### Patch Changes

- b884a95: make address optional for useBalance and Balance component
- b884a95: make Address size prop optional
- b884a95: ui polish to debug component
- b884a95: UI polish
- b884a95: setup themeing for components package
- b884a95: feat: have common BaseInput for Input components
- b884a95: Address component blockexplorer link and "use client" for all components
- b884a95: fix refocus scroll on Input components
  update collapsible component to use rounded-2xl
  have default font family for all components
  fix base input component colors
- Updated dependencies [b884a95]
- Updated dependencies [b884a95]
  - @scaffold-hbar-ui/hooks@0.1.2

## 0.1.2-rc.5

### Patch Changes

- 8a1385f: fix refocus scroll on Input components
  update collapsible component to use rounded-2xl
  have default font family for all components
  fix base input component colors

## 0.1.2-rc.4

### Patch Changes

- 5e5778b: make address optional for useBalance and Balance component
- 5e5778b: ui polish to debug component
- 5e5778b: Address component blockexplorer link and "use client" for all components
- Updated dependencies [5e5778b]
  - @scaffold-hbar-ui/hooks@0.1.2-rc.1

## 0.1.2-rc.3

### Patch Changes

- bd0d241: UI polish

## 0.1.2-rc.2

### Patch Changes

- 211c108: make Address size prop optional

## 0.1.2-rc.1

### Patch Changes

- b3da6fe: setup themeing for components package

## 0.1.2-rc.0

### Patch Changes

- 4baa885: feat: have common BaseInput for Input components
- Updated dependencies [6674b6e]
  - @scaffold-hbar-ui/hooks@0.1.2-rc.0

## 0.1.1

### Patch Changes

- 8f807af: add initial component and hooks
- Updated dependencies [8f807af]
  - @scaffold-hbar-ui/hooks@0.1.1
