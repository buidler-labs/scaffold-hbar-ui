"use client";

import React, { useState } from "react";
import type { Address as AddressType } from "viem";
import { hederaTestnet, mainnet } from "viem/chains";
import {
  Address,
  Balance,
  HederaAddress,
  HederaAddressInput,
  HbarInput,
} from "@scaffold-ui/components";
import { ExampleCard } from "./ExampleCard";

export const AddressComponentExample: React.FC = () => {
  const exampleEvmAddress = "0x0000000000000000000000000000000000000000";
  const exampleHederaAccountId = "0.0.10371555";

  const [inputValue, setInputValue] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState<AddressType | undefined>(undefined);

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <ExampleCard title="Address Component Usage (EVM)">
        <Address address={exampleEvmAddress} />
      </ExampleCard>

      <ExampleCard title="Address Component Usage (Hedera)">
        <HederaAddress
          address={exampleEvmAddress}
          hederaAccountId={exampleHederaAccountId}
          chain={hederaTestnet}
        />
      </ExampleCard>

      <ExampleCard title="Balance (Hedera / HBAR)">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-base-content/70">Address balance on Hedera testnet (click to toggle HBAR ↔ USD):</span>
          <Balance address={exampleEvmAddress} chain={hederaTestnet} />
        </div>
      </ExampleCard>

      <ExampleCard title="HederaAddressInput (EVM or 0.0.12345)">
        <div className="flex flex-col gap-4 w-full">
          <HederaAddressInput
            value={inputValue}
            onChange={addr => {
              setResolvedAddress(addr);
              setInputValue(addr);
            }}
            chainId={hederaTestnet.id}
            placeholder="0x... or 0.0.12345"
          />
          {resolvedAddress && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-base-content/70">Resolved address (upstream):</span>
              <HederaAddress address={resolvedAddress} chain={hederaTestnet} />
            </div>
          )}
        </div>
      </ExampleCard>

      <ExampleCard title="HbarInput (HBAR by default)">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-xs text-base-content/70">Native token + USD toggle (defaults to Hedera testnet / HBAR):</span>
          <HbarInput placeholder="Amount in HBAR or USD" />
        </div>
      </ExampleCard>

      <ExampleCard title="HbarInput with ETH (chain=mainnet)">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-xs text-base-content/70">Same component with chain=mainnet for ETH:</span>
          <HbarInput chain={mainnet} placeholder="Amount in ETH or USD" />
        </div>
      </ExampleCard>
    </div>
  );
};
