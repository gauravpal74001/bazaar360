import { useState } from "react"
import Productcard from "../components/product-card"
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/product-api";
import toast from "react-hot-toast";
import type { cartItems, CustomError } from "../types/types";
import { server } from "../redux/store";
import Skeleton from "../components/skeleton";
import { useDispatch } from "react-redux";
import { addToCart, cartReducer } from "../redux/reducer/cartReducer";

const Search = () => {
  
  const [search, setearch]=useState("");
  const [sort , setsort]=useState("");
  const [maxprice, setmaxprice]=useState(100000);
  const [category, setcategory]=useState("");  
  const [page,setpage]=useState(1);

  const {data:dataCategories} =useCategoriesQuery('');
  const {data , isError , error , isLoading }=useSearchProductsQuery({search , sort , category , price : maxprice , page});
  if(isError) toast.error((error as CustomError ).data.message );

  const dispatch= useDispatch();
  const cartHandler=(cartItems:cartItems)=>{
    if(cartItems.stock < 1 ){toast.error("Out of Stock"); return ;}
    else{
      dispatch(addToCart(cartItems));
      toast.success("Item added to cart");
    }
  };

  const isprevpage=page>1;
  const isnextpage=page<10;
  return (
    <div className="searchimage">
       <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
           <select
            value={sort} onChange={(e)=>{setsort(e.target.value)}}>
            <option value="">none</option>
            <option value="asc">Price Low To High</option>
            <option value="desc">Price High To Low</option>
           </select>
        </div>
        <div>
          <h4>MaxPrice :{maxprice}</h4>
          <input 
          type="range"
          min={100}
          max={100000}
          value={maxprice}
          onChange={(e)=>{setmaxprice(Number(e.target.value))}}
          >
          </input>
        </div>
        <div>
          <h4>category</h4>
           <select
            value={category} onChange={(e)=>{setcategory(e.target.value)}}>
            <option value="">All</option>
            { dataCategories?.categories.map((i)=>(
              <option key={i} value={i}>{i}</option>
            ))}
            
           </select>
        </div>
         
       </aside>
       <main>
         <h2>Products</h2>
         <input value={search} onChange={(e)=>{setearch(e.target.value)}} placeholder="search by name"></input>
         
         {
          isLoading ? <Skeleton/> : <div className="product-card-container"> 
          { data?.products.map((i)=>(<Productcard 
             key={i._id}
             productId={i._id}
             name={i.name}
             price={i.price}
             photo={`${server}/${i.photo}`}
             stock={i.stock}
             handler={cartHandler}
              />)
             
          )}
        </div>
         }

        {
          data?.totalPage && data.totalPage > 1 ? ( <article>
            <button  disabled={!isprevpage}onClick={()=>{setpage((prev)=>prev-1)}}>prev</button>
            <span>{page} of {data?.totalPage}</span>
            <button disabled={!isnextpage} onClick={()=>{setpage((prev)=>prev+1)}}>next</button>
          </article>) : (null)
        }

       </main>
    </div>
  )
}

export default Search;
