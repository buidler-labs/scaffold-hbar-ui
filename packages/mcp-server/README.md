# @scaffold-hbar-ui/mcp-server

Model Context Protocol (MCP) server that exposes **scaffold-hbar-ui** documentation, TypeScript props, hook signatures, and example app code so AI agents can answer with accurate imports and APIs.

## Features

- **Tools**: `search_components`, `search_hooks`, `get_component_props`, `get_hook_signature`, `get_component_example`, `get_hook_example`, `get_installation_guide`, `get_theming_guide`
- **Resources**: `scaffold-hbar-ui://` URIs for MDX docs, examples, and JSON API listings
- **Prompts**: `scaffold-hbar-ui/use-component`, `scaffold-hbar-ui/hedera-dapp-setup`
- **Transports**: stdio (default) for Cursor / Claude Desktop, or **Streamable HTTP** with `--http` for remote agents

## Build

From the monorepo root:

```bash
pnpm install
cd packages/mcp-server && pnpm build
```

This runs `extract` (generates `src/generated/metadata.json` from docs and sources) and compiles TypeScript.

## Quick test (MCP Inspector)

The fastest way to explore the server is the official [MCP Inspector](https://github.com/modelcontextprotocol/inspector) — a visual debugger that launches the server and lets you click through tools, resources, and prompts:

```bash
# from packages/mcp-server, after `pnpm build`
npx @modelcontextprotocol/inspector node ./dist/esm/bin/scaffold-hbar-ui-mcp.js
```

Open the printed `http://localhost:6274` URL, then try:

- **Tools** → `search_components` (query `hedera`), `get_component_props` (name `HbarInput`), `get_hook_signature` (name `useBalance`)
- **Resources** → `scaffold-hbar-ui://api/components`, or the templated `scaffold-hbar-ui://components/Address`
- **Prompts** → `scaffold-hbar-ui/use-component`

## Use it in an MCP client (Cursor, Claude Desktop, …)

The server speaks MCP over **stdio**, so any MCP-capable client can spawn it. Add an entry to the client's MCP config, then fully restart the client. See the official guide on [connecting to local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers) for the general flow.

After publishing to npm (no local checkout needed):

```json
{
  "mcpServers": {
    "scaffold-hbar-ui": {
      "command": "npx",
      "args": ["-y", "@scaffold-hbar-ui/mcp-server"]
    }
  }
}
```

For local development, point at the built binary instead (run `pnpm build` first):

```json
{
  "mcpServers": {
    "scaffold-hbar-ui": {
      "command": "node",
      "args": ["/absolute/path/to/scaffold-hbar-ui/packages/mcp-server/dist/esm/bin/scaffold-hbar-ui-mcp.js"]
    }
  }
}
```

**Where to put the config:**

- **Cursor** — `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` inside a project. Working in this repo? Copy [`.cursor/mcp.json.example`](../../.cursor/mcp.json.example) to `.cursor/mcp.json` — it uses `${workspaceFolder}`, so no path edits are needed.
- **Claude Desktop** — Settings → Developer → Edit Config, which opens `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows).

Restart the client, confirm the `scaffold-hbar-ui` server shows as connected, then ask something like _"Use the scaffold-hbar-ui tools to show the HbarInput props and a usage example."_ If it doesn't connect, check the client's MCP logs (Claude Desktop: `~/Library/Logs/Claude/mcp*.log`).

## HTTP (remote)

```bash
PORT=3100 node ./dist/esm/bin/scaffold-hbar-ui-mcp.js --http
```

Optional auth:

```bash
SCAFFOLD_HBAR_UI_MCP_KEY=secret node ./dist/esm/bin/scaffold-hbar-ui-mcp.js --http
```

Clients must send `Authorization: Bearer <secret>`.

Connect with:

```json
{
  "mcpServers": {
    "scaffold-hbar-ui": {
      "url": "http://localhost:3100/mcp"
    }
  }
}
```

**Streamable HTTP** clients must send `Accept: application/json, text/event-stream` (MCP requirement). Example:

```bash
curl -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"curl","version":"1"}}}'
```

## Docker

See [Dockerfile](./Dockerfile) in this package. Build from the **repository root** so the extract step can read `docs/` and `packages/`:

```bash
docker build -f packages/mcp-server/Dockerfile -t scaffold-hbar-ui-mcp .
```
