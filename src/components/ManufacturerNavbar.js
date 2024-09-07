import React from "react";

const ManufacturerNavbar = () => {
  return (
    <ul>
      <li>
        <a href="/manufacturers">Authorized vendors</a>
      </li>
      <li>
        <a href="/manufacturers/requests">Pending requests</a>
      </li>
    </ul>
  );
};

export default ManufacturerNavbar;
