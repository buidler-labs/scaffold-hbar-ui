"use client";

import React, { useState } from "react";
import type { Address as AddressType, Chain } from "viem";
import { getAddress } from "viem";
import { useHederaAccountId, getBlockExplorerAddressLink } from "@scaffold-ui/hooks";

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const DocumentDuplicateIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
    />
  </svg>
);

export type HederaAddressProps = {
  address?: AddressType;
  hederaAccountId?: string;
  chain: Chain;
  format?: "short" | "long";
  disableAddressLink?: boolean;
  avatarComponent?: React.ComponentType<{ address: string; size: number; ensImage: string | null }>;
  showEvmAddress?: boolean;
};

export const HederaAddress = ({
  address,
  hederaAccountId,
  chain,
  format,
  disableAddressLink,
  avatarComponent: AvatarComponent,
  showEvmAddress = true,
}: HederaAddressProps) => {
  const [copied, setCopied] = useState(false);
  const { accountId, isLoading } = useHederaAccountId(address, chain.id);

  if (!address && !hederaAccountId) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-6 h-6 rounded-full bg-base-300" />
        <div className="w-32 h-4 rounded bg-base-300" />
      </div>
    );
  }

  const hasEvmAddress = Boolean(address);
  const resolvedAddress = hasEvmAddress ? getAddress(address as AddressType) : undefined;
  const resolvedAccountId = hederaAccountId ?? accountId ?? undefined;

  const primaryRaw = resolvedAccountId ?? resolvedAddress!;
  const secondaryRaw = resolvedAccountId && showEvmAddress ? resolvedAddress : undefined;

  // Hedera Account ID should always display fully (no ellipsis).
  const primaryDisplay =
    resolvedAccountId || !resolvedAddress
      ? primaryRaw
      : format === "long"
        ? primaryRaw
        : `${primaryRaw.slice(0, 6)}...${primaryRaw.slice(-4)}`;

  const secondaryDisplay =
    secondaryRaw &&
    (format === "long" ? secondaryRaw : `${secondaryRaw.slice(0, 6)}...${secondaryRaw.slice(-4)}`);

  const explorerLink = getBlockExplorerAddressLink(chain, primaryRaw);

  const handleCopy = () => {
    navigator.clipboard.writeText(primaryRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  const primaryContent = <span className="text-sm font-normal">{primaryDisplay}</span>;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        {AvatarComponent ? (
          <AvatarComponent address={primaryRaw} size={24} ensImage={null} />
        ) : (
          <div className="w-6 h-6 rounded-full bg-base-300" />
        )}
        {disableAddressLink ? (
          primaryContent
        ) : (
          <a href={explorerLink} target="_blank" rel="noreferrer" className="link no-underline hover:underline">
            {primaryContent}
          </a>
        )}
        <button type="button" className="btn btn-ghost btn-xs p-0 min-h-0 h-auto" onClick={handleCopy}>
          {copied ? (
            <CheckCircleIcon className="h-4 w-4 text-success" />
          ) : (
            <DocumentDuplicateIcon className="h-4 w-4 opacity-70 hover:opacity-100" />
          )}
        </button>
      </div>
      {isLoading ? (
        <span className="text-xs text-base-content/60 animate-pulse">Resolving Hedera Account ID…</span>
      ) : resolvedAccountId ? (
        <span className="text-xs text-base-content/80">
          Hedera Account ID: {resolvedAccountId}
        </span>
      ) : null}
      {secondaryDisplay && (
        <span className="text-xs text-base-content/60">
          EVM: {secondaryDisplay}
        </span>
      )}
    </div>
  );
};
