import React from "react";

const VendorNavbar = () => {
  return (
    <ul>
      <li>
        <a href="/vendors">Sold products</a>
      </li>
      <li>
        <a href="/vendors/newproduct">New product</a>
      </li>
      <li>
        <a href="/vendors/authorizedManufacturers">Authorized by</a>
      </li>
      <li>
        <a href="/vendors/newrequest">New request</a>
      </li>
      <li>
        <a href="/vendors/register">Register</a>
      </li>
    </ul>
  );
};

export default VendorNavbar;
