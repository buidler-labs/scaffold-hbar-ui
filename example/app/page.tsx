"use client";

import type { NextPage } from "next";
import { AddressComponentExample } from "./components/AddressComponentExample";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow py-10 px-5">
      <AddressComponentExample />
    </div>
  );
};

export default Home;
