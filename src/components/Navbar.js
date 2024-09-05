import React from "react";
import Image from "next/image";

import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <nav class="topnav">
      <a href="/">
        <Image src="/SureBuy.png" width={143} height={100} />
      </a>
      <a class="toplinks" href="/buyers">
        For Buyers
      </a>
      <a class="toplinks" href="/vendors">
        For Vendors
      </a>
      <a class="toplinks" href="/manufacturers">
        For Manufacturers
      </a>
      <div class="connectbutton">
        <ConnectButton chainStatus="icon" />
      </div>
    </nav>
  );
};

export default Navbar;
