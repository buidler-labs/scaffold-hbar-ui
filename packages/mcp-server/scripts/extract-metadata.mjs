/**
 * Build-time script: reads docs, examples, and TypeScript sources from the monorepo
 * and writes src/generated/metadata.json for the MCP server bundle.
 *
 * Prop types and hook signatures are discovered by walking each package's `src`
 * tree (no hardcoded file lists), so new components/hooks are picked up
 * automatically. The only manual entries are for debug inputs that reuse a shared
 * `CommonInputProps` instead of exporting their own named props type.
 */
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(SCRIPT_DIR, "..");
const REPO_ROOT = join(PKG_ROOT, "..", "..");

const PACKAGE_SOURCES = {
  components: join(REPO_ROOT, "packages/components/src"),
  hooks: join(REPO_ROOT, "packages/hooks/src"),
  debugContracts: join(REPO_ROOT, "packages/debug-contracts/src"),
};

const PACKAGE_READMES = {
  components: join(REPO_ROOT, "packages/components/README.md"),
  hooks: join(REPO_ROOT, "packages/hooks/README.md"),
  debugContracts: join(REPO_ROOT, "packages/debug-contracts/README.md"),
};

const DOC_DIRS = {
  components: join(REPO_ROOT, "docs/pages/components"),
  hooks: join(REPO_ROOT, "docs/pages/hooks"),
  debugContracts: join(REPO_ROOT, "docs/pages/debug-contracts"),
  index: join(REPO_ROOT, "docs/pages/index.mdx"),
  theme: join(REPO_ROOT, "docs/pages/components/Theming.mdx"),
};

const EXAMPLES_DIR = join(REPO_ROOT, "example/app/components/examples");

/**
 * Debug inputs that reuse `CommonInputProps<string>` instead of exporting their
 * own named `*Props` type, so they cannot be auto-extracted from source.
 */
const MANUAL_DEBUG_PROP_OVERRIDES = {
  IntegerInput:
    "type IntegerInputProps = CommonInputProps<string> & {\n  variant?: IntegerVariant;\n};",
  BytesInput:
    "Props: CommonInputProps<string> (same as BaseInput for string values).",
  Bytes32Input:
    "Props: CommonInputProps<string> (32-byte hex / string toggle via suffix).",
};

// --- Filesystem helpers ------------------------------------------------------

function read(filePath) {
  return readFileSync(filePath, "utf8");
}

function repoRelative(filePath) {
  return filePath.replace(REPO_ROOT + "/", "");
}

/** Recursively collect `.ts`/`.tsx` files under `rootDir`, sorted for stable output. */
function walkSourceFiles(rootDir) {
  if (!existsSync(rootDir)) return [];
  const files = [];
  const entries = readdirSync(rootDir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(fullPath));
    } else if (/\.tsx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function listMdxBasenames(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort();
}

function firstLine(markdown) {
  const line = markdown
    .split("\n")
    .find((text) => text.trim().length > 0 && !text.trim().startsWith("#"));
  return line ? line.replace(/^[*-]\s*/, "").slice(0, 200) : "";
}

// --- MDX docs ----------------------------------------------------------------

function readMdx(dir, name) {
  const filePath = join(dir, `${name}.mdx`);
  if (!existsSync(filePath)) return null;
  const { data, content } = matter(read(filePath));
  return {
    title: data.title ?? name,
    body: content.trim(),
    path: repoRelative(filePath),
  };
}

function collectMdxDocs(dir, { skip = [] } = {}) {
  const docs = {};
  for (const base of listMdxBasenames(dir)) {
    if (skip.includes(base)) continue;
    const doc = readMdx(dir, base);
    if (doc) docs[base] = doc;
  }
  return docs;
}

function readMdxBody(filePath) {
  return existsSync(filePath) ? matter(read(filePath)).content.trim() : "";
}

// --- TypeScript source parsing -----------------------------------------------

/** Advance past a string literal or comment starting at `index`; returns the same index otherwise. */
function skipStringAndComments(source, index) {
  const char = source[index];
  if (char === "/" && source[index + 1] === "/") {
    while (index < source.length && source[index] !== "\n") index++;
    return index;
  }
  if (char === "/" && source[index + 1] === "*") {
    index += 2;
    while (
      index < source.length - 1 &&
      !(source[index] === "*" && source[index + 1] === "/")
    )
      index++;
    return index + 2;
  }
  if (char === '"' || char === "'" || char === "`") {
    const quote = char;
    index++;
    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
        continue;
      }
      if (source[index] === quote) break;
      index++;
    }
    return index + 1;
  }
  return index;
}

/** Skip whitespace and a balanced `<...>` generic parameter list starting at `index`. */
function skipGenericParams(source, index) {
  while (index < source.length && /\s/.test(source[index])) index++;
  if (source[index] !== "<") return index;
  let angle = 0;
  for (; index < source.length; index++) {
    if (source[index] === "<") angle++;
    else if (source[index] === ">" && --angle === 0) return index + 1;
  }
  return index;
}

/** Parses `export type Name<...> = ...;`, balancing brackets and ignoring strings/comments. */
function extractTypeAlias(source, typeName) {
  const declaration = `export type ${typeName}`;
  const start = source.indexOf(declaration);
  if (start === -1) return extractInterface(source, typeName);

  let index = skipGenericParams(source, start + declaration.length);
  while (index < source.length && /\s/.test(source[index])) index++;
  if (source[index] !== "=") return null;
  index++;

  let angle = 0;
  let brace = 0;
  let paren = 0;
  while (index < source.length) {
    const next = skipStringAndComments(source, index);
    if (next > index) {
      index = next;
      continue;
    }
    // Skip arrow tokens so the `>` in `=>` is not treated as a closing generic.
    if (source[index] === "=" && source[index + 1] === ">") {
      index += 2;
      continue;
    }
    const char = source[index];
    if (char === "<") angle++;
    else if (char === ">") angle--;
    else if (char === "{") brace++;
    else if (char === "}") brace--;
    else if (char === "(") paren++;
    else if (char === ")") paren--;
    if (char === ";" && angle === 0 && brace === 0 && paren === 0) {
      return source.slice(start, index + 1).trim();
    }
    index++;
  }
  return null;
}

/** Parses `export interface Name<...> { ... }` by balancing braces. */
function extractInterface(source, typeName) {
  const declaration = `export interface ${typeName}`;
  const start = source.indexOf(declaration);
  if (start === -1) return null;

  let index = skipGenericParams(source, start + declaration.length);
  while (index < source.length && /\s/.test(source[index])) index++;
  if (source[index] !== "{") return null;

  let depth = 0;
  for (; index < source.length; index++) {
    if (source[index] === "{") depth++;
    else if (source[index] === "}" && --depth === 0) {
      return source.slice(start, index + 1).trim();
    }
  }
  return null;
}

/** Returns the JSDoc block and a one-line signature excerpt for an exported hook. */
function extractHookHeader(source, hookName) {
  const documentedPatterns = [
    new RegExp(`(/\\*\\*[\\s\\S]*?\\*/)\\s*export function ${hookName}\\s*\\(`, "m"),
    new RegExp(`(/\\*\\*[\\s\\S]*?\\*/)\\s*export const ${hookName}\\s*=`, "m"),
  ];
  for (const pattern of documentedPatterns) {
    const match = source.match(pattern);
    if (match) {
      const jsdoc = match[1]?.trim() ?? "";
      const afterSignature = source.slice(
        source.indexOf(match[0]) + match[0].length,
      );
      const bodyStart = afterSignature.indexOf("{");
      const params = afterSignature
        .slice(0, bodyStart > -1 ? bodyStart : 200)
        .trim();
      return { jsdoc, signature: `${hookName}(${params}) { ... }` };
    }
  }

  const fallback = source.match(
    new RegExp(`export (?:function|const) ${hookName}[\\s\\S]{0,1200}?\\{`, "m"),
  );
  return {
    jsdoc: "",
    signature: fallback
      ? fallback[0].replace(/\{$/, "").trim() + " { ... }"
      : `${hookName}(...)`,
  };
}

// --- Source discovery --------------------------------------------------------

const EXPORTED_PROPS_TYPE = /export\s+(?:type|interface)\s+([A-Za-z0-9_]+Props)\b/g;
const EXPORTED_HOOK = /export\s+(?:function|const)\s+(use[A-Za-z0-9_]+)\b/g;

/** Discover exported `*Props` types in a package, keyed by component name (type name minus `Props`). */
function discoverPropTypes(srcDir) {
  const props = {};
  for (const filePath of walkSourceFiles(srcDir)) {
    const source = read(filePath);
    for (const [, typeName] of source.matchAll(EXPORTED_PROPS_TYPE)) {
      const block = extractTypeAlias(source, typeName);
      if (block) props[typeName.replace(/Props$/, "")] = block;
    }
  }
  return props;
}

/** Discover exported `use*` hooks in a package, keyed by hook name. */
function discoverHookSignatures(srcDir) {
  const signatures = {};
  for (const filePath of walkSourceFiles(srcDir)) {
    const source = read(filePath);
    for (const [, hookName] of source.matchAll(EXPORTED_HOOK)) {
      signatures[hookName] = extractHookHeader(source, hookName);
    }
  }
  return signatures;
}

function withFallbacks(discovered, fallbacks) {
  const result = { ...discovered };
  for (const [name, block] of Object.entries(fallbacks)) {
    if (!result[name]) result[name] = block;
  }
  return result;
}

// --- Derived docs ------------------------------------------------------------

function buildPeerDepsSection() {
  return [
    "### Peer dependencies",
    "",
    "React 19, `viem`, `wagmi`, `@tanstack/react-query`, `@types/react`.",
    "For Hedera native transaction hooks: `@hiero-ledger/sdk`.",
    "Import styles once at app root:",
    "",
    "```ts",
    'import "@scaffold-hbar-ui/components/styles.css";',
    'import "@scaffold-hbar-ui/debug-contracts/styles.css"; // if using debug UI',
    "```",
  ].join("\n");
}

function buildInstallationSnippet(componentsReadme) {
  return [
    "## Packages",
    "",
    "- `@scaffold-hbar-ui/components` — UI components",
    "- `@scaffold-hbar-ui/hooks` — React hooks (required peer of components)",
    "- `@scaffold-hbar-ui/debug-contracts` — Contract debug UI",
    "",
    "### Install",
    "",
    "```bash",
    "pnpm add @scaffold-hbar-ui/components @scaffold-hbar-ui/hooks",
    "# optional:",
    "pnpm add @scaffold-hbar-ui/debug-contracts",
    "```",
    "",
    buildPeerDepsSection(),
    "",
    "### Package READMEs (summary)",
    "",
    componentsReadme.slice(0, 2000),
  ].join("\n");
}

function toCatalog(docs) {
  return Object.keys(docs).map((name) => ({
    name,
    description: firstLine(docs[name].body),
  }));
}

function collectExamples(dir) {
  if (!existsSync(dir)) return {};
  const examples = {};
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".tsx")) continue;
    const filePath = join(dir, file);
    examples[file.replace(/\.tsx$/, "")] = {
      content: read(filePath),
      path: repoRelative(filePath),
    };
  }
  return examples;
}

// --- Main --------------------------------------------------------------------

function main() {
  const components = collectMdxDocs(DOC_DIRS.components);
  const hooks = collectMdxDocs(DOC_DIRS.hooks, { skip: ["index"] });
  const debugContracts = collectMdxDocs(DOC_DIRS.debugContracts);

  const packageReadmes = {
    components: read(PACKAGE_READMES.components),
    hooks: read(PACKAGE_READMES.hooks),
    debugContracts: read(PACKAGE_READMES.debugContracts),
  };

  const componentProps = discoverPropTypes(PACKAGE_SOURCES.components);
  const debugProps = withFallbacks(
    discoverPropTypes(PACKAGE_SOURCES.debugContracts),
    MANUAL_DEBUG_PROP_OVERRIDES,
  );
  const hookSignatures = discoverHookSignatures(PACKAGE_SOURCES.hooks);

  const metadata = {
    version: 1,
    generatedAt: new Date().toISOString(),
    components,
    hooks,
    debugContracts,
    examples: collectExamples(EXAMPLES_DIR),
    gettingStarted: readMdxBody(DOC_DIRS.index),
    packageReadmes,
    installationSnippet: buildInstallationSnippet(packageReadmes.components),
    themeDoc: readMdxBody(DOC_DIRS.theme),
    componentProps,
    debugProps,
    hookSignatures,
    catalog: {
      components: toCatalog(components),
      hooks: toCatalog(hooks),
      debugContracts: toCatalog(debugContracts),
    },
  };

  const outDir = join(PKG_ROOT, "src/generated");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
    "utf8",
  );

  console.log(
    `Wrote metadata.json: ${Object.keys(components).length} components, ` +
      `${Object.keys(hooks).length} hooks, ` +
      `${Object.keys(componentProps).length} component props, ` +
      `${Object.keys(debugProps).length} debug props, ` +
      `${Object.keys(hookSignatures).length} hook signatures`,
  );
}

main();
