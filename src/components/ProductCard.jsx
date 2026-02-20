import { addToCart } from "../api/api";

const ProductCard = ({ product }) => {
  const handleAdd = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
