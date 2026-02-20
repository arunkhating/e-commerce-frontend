import React, { useEffect, useState } from "react";
import { getCart } from "../api/api";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then((res) => {
      setCart(res.data);
    });
  }, []);

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>{item.product.name}</div>
      ))}
    </div>
  );
};

export default Cart;
