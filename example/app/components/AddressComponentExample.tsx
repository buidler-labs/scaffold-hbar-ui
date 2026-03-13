"use client";

import React from "react";
import { hederaTestnet } from "viem/chains";
import { Address, HederaAddress } from "@scaffold-ui/components";
import { ExampleCard } from "./ExampleCard";

export const AddressComponentExample: React.FC = () => {
  const exampleEvmAddress = "0x0000000000000000000000000000000000000000";
  const exampleHederaAccountId = "0.0.10371555";

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
    </div>
  );
};
