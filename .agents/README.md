# Agent definitions (tool-agnostic)

Markdown files here mirror [`.claude/agents/`](../.claude/agents/) so editors or automation that expect a top-level `.agents/` directory can load the same **scaffold-hbar-ui** personas:

| File | Focus |
|------|--------|
| [scaffold-hbar-ui-components.md](scaffold-hbar-ui-components.md) | Packages, imports, CSS, invariants |
| [scaffold-hbar-ui-hedera-inputs.md](scaffold-hbar-ui-hedera-inputs.md) | HederaAddressInput, HbarInput, hooks |
| [scaffold-hbar-ui-example-app.md](scaffold-hbar-ui-example-app.md) | Example app providers and demos |

**Claude Code** also reads `.claude/agents/` directly. **Cursor** loads skills from `.cursor/skills/`. Keeping all three in sync is manual today; edit the Cursor or `.claude` skill/agent copy and replicate critical changes to the others if they drift.
