"use client";

import { mainnet } from "viem/chains";
import { HbarInput, type HbarInputProps } from "./HbarInput";

/** Props for EtherInput; same as HbarInputProps. Chain defaults to mainnet when using EtherInput. */
export type EtherInputProps = HbarInputProps;

/**
 * Backward-compatible alias: same as HbarInput but defaults chain to mainnet (ETH).
 * Prefer HbarInput for Hedera apps (defaults to hederaTestnet / HBAR).
 */
export const EtherInput = (props: EtherInputProps) => {
  return <HbarInput {...props} chain={props.chain ?? mainnet} />;
};
