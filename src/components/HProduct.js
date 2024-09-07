import React from "react";
import Image from "next/image";

export default function HProduct(product) {
  return (
    <div>
      <div className="productImg">
        <Image src={product.uri} width={200} height={120} />
      </div>
      <h2 class="productName">{product.name}</h2>
      <h3 className="productName">
        {"Manufactured by " + product.manufacturer}
      </h3>
      <p className="productP">{product.description}</p>
      <p className="productP">{product.price + " ETH"}</p>
    </div>
  );
}
