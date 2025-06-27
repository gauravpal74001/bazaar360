import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/product-api";
import toast from "react-hot-toast";
import type { cartItems, Product } from "../types/types";
import { server } from "../redux/store";
import Skeleton from "../components/skeleton";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";


const Home = () => {
  const dispatch = useDispatch();
  const addToCartHandler = (cartItems : cartItems) => {
    if(cartItems.stock < 1 ) toast.error("Out of Stock");
    else{
      dispatch(addToCart(cartItems));
      toast.success("Item added to cart");
    }
  };
  

  const { data, isLoading, isError } = useLatestProductsQuery("");
  
  if (isError) {
    return toast.error("Error fetching products");
  }

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>

      <main>
        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : data?.products && data.products.length > 0 ? (
          data.products.map((product) => (
            <ProductCard 
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCartHandler}
              photo={`${server}/${product.photo}`}
            />
          ))
        ) : (
          <p>No Products Available</p>
        )}
      </main>
    </div>
  );
};

export default Home;
