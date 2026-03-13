"use client";

import React from "react";

type ExampleCardProps = {
  title: string;
  children: React.ReactNode;
};

export const ExampleCard: React.FC<ExampleCardProps> = ({ title, children }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-base-100 rounded-2xl shadow-lg p-6 border border-primary/60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full hedera-gradient flex items-center justify-center" />
          <h3 className="font-bold text-lg text-center">{title}</h3>
        </div>
        <div className="mt-4 flex justify-center">{children}</div>
      </div>
    </div>
  );
};

