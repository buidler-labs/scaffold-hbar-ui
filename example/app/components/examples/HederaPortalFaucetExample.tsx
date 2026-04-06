"use client";

import { HederaPortalFaucet } from "@scaffold-ui/components";
import { ExampleCard } from "../ExampleCard";
import { DEMO_EVM_ADDRESS } from "./demoConstants";

export function HederaPortalFaucetExample() {
  return (
    <ExampleCard
      maxWidth="wide"
      title="HederaPortalFaucet"
      description="Testnet faucet link or button."
    >
      <div className="flex flex-col gap-5 items-start w-full max-w-prose">
        <div className="flex flex-col gap-2 items-start max-w-full">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Default (uses connected wallet)
          </span>
          <HederaPortalFaucet className="w-fit" />
        </div>

        <div className="flex flex-col gap-2 items-start max-w-full">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
            Explicit address + custom label
          </span>
          <HederaPortalFaucet
            className="w-fit"
            address={DEMO_EVM_ADDRESS}
            label="Open faucet for demo address"
          />
        </div>

        <div className="flex flex-col gap-2 items-start max-w-full">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Link variant</span>
          <HederaPortalFaucet
            className="w-fit"
            address={DEMO_EVM_ADDRESS}
            variant="link"
            label="Testnet HBAR (link style)"
          />
        </div>

        <div className="flex flex-col gap-2 items-start max-w-full">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Custom children</span>
          <HederaPortalFaucet
            className="w-fit"
            address={DEMO_EVM_ADDRESS}
            showIcon={false}
          >
            <span className="underline">Custom faucet CTA</span>
          </HederaPortalFaucet>
        </div>
      </div>
    </ExampleCard>
  );
}
