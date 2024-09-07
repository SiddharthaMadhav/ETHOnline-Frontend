import Image from "next/image";

export default function Product(product) {
  async function buyclick() {
    console.log("Clicked!");
  }

  return (
    <div class="ProductDiv">
      <div className="productImg">
        <Image src={product.uri} width={200} height={120} />
      </div>
      <h2 class="productName">{product.name}</h2>
      <button
        type="button"
        onClick={() => {
          product.onClick(product.id, product.price);
        }}
        class="productButton"
      >
        Buy now
      </button>
      <h3 className="productName">
        {"Manufactured by " + product.manufacturer}
      </h3>
      <p className="productP">{product.description}</p>
      <p className="productP">{product.price + " ETH"}</p>
    </div>
  );
}
