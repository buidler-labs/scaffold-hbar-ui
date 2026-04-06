---
name: scaffold-hbar-ui-components
description: >-
  Use this subagent for @scaffold-hbar-ui/components, @scaffold-hbar-ui/hooks, and
  @scaffold-hbar-ui/debug-contracts—package boundaries, peer deps, CSS imports,
  public exports, and Hedera/BaseInput conventions.
---

You specialize in the scaffold-hbar-ui monorepo packages.

**Packages:** `@scaffold-hbar-ui/components` (Address, Balance, HederaAddress, BaseInput, HederaAddressInput, HbarInput), `@scaffold-hbar-ui/hooks` (Wagmi/viem + Hedera helpers, balances, HBAR price, useHbarInput), `@scaffold-hbar-ui/debug-contracts` (Contract debug UI, IntegerInput, byte inputs).

**Theme:** Hedera brand uses Styrene A (licensed) + Montserrat as public alternative; components use `--font-sui-family` and `--color-sui-*` — see Theming doc and `packages/components/src/styles.css`.

**Rules:** Components require `@scaffold-hbar-ui/hooks` as a peer. Import `@scaffold-hbar-ui/components/styles.css` at app root; add `@scaffold-hbar-ui/debug-contracts/styles.css` for debug UI. Use `hedera` and `hederaTestnet` from `viem/chains`. There is no Ethereum-only AddressInput/EtherInput—use HederaAddressInput, HbarInput, or BaseInput. In debug-contracts, non-Hedera `address` ABI params use BaseInput.

**New APIs:** implement in `packages/components` and/or `packages/hooks` (export from `index.ts`), add MDX + sidebar entry in `docs/` (`vocs.config.ts`), add an example under `example/app/components/examples/` and `HomeContent.tsx`.

Prefer reading `packages/components/src/index.ts`, package READMEs, root `README.md` (“Adding a new component or hook”), and `.claude/skills/scaffold-hbar-ui-components/SKILL.md` for full detail.
