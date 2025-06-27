import { FaPlus } from "react-icons/fa";
import type { cartItems } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItems: cartItems) => void;
};

const ProductCard = ({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}: ProductsProps) => {
  const getStockClass = () => {
    if (stock === 0) return "out-of-stock";
    if (stock < 5) return "low-stock";
    return "in-stock";
  };

  return (
    <div className="product-card">
      <img src={photo} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <span className="product-price">₹{price}</span>
        <span className={`product-stock ${getStockClass()}`}>
          {stock === 0 ? "Out of Stock" : stock < 5 ? `Only ${stock} left` : `${stock} in stock`}
        </span>
      </div>
      <div className="product-actions">
        <button onClick={()=>handler({productId, name, price, stock, photo , quantity:1})} disabled={stock === 0}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

