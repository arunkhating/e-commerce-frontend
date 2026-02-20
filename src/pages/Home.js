import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";


function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));

  }, []);

  return (
    <div>
      <h1>Products</h1>

{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}


    </div>
  );
}

export default Home;
