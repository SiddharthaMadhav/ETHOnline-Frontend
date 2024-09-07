import React from "react";

const Request = (request) => {
  return (
    <div class="request">
      <h2 class="requestName">{"Name of the vendor: " + request.name}</h2>
      <h3 class="requestName">{"Address of the vendor: " + request.address}</h3>
      <button
        class="requestButton"
        onClick={() => {
          request.accept(request.id);
        }}
      >
        Accept
      </button>
      <button
        class="requestButton"
        onClick={() => {
          request.decline(request.id);
        }}
      >
        Decline
      </button>
    </div>
  );
};

export default Request;
