import { useEffect, useState  } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useProductdetailsQuery, useUpdadteProductsMutation } from "../../../redux/api/product-api";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { userReducerInitialStateTypes } from "../../../types/user-reducer";
import type { Product } from "../../../types/types";
import {useDeleteProductsMutation } from "../../../redux/api/product-api";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";




const Productmanagement = () => {
  const navigate = useNavigate();
  const {user} =useSelector((state : {userReducer : userReducerInitialStateTypes})=>state.userReducer);
  const {id} = useParams();
  const {data , isError} = useProductdetailsQuery(id!);
  const [updateProduct]=useUpdadteProductsMutation();
  const [deleteProduct]=useDeleteProductsMutation();

  if(isError){
    return <Navigate to={`/404`}/>;
  }

  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    stock: 0,
    photo: "",
    _id: "",
    category: "",
  });

  const {name , price , stock , photo , _id , category}=product;

  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>("");
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
     const formData = new FormData();

     if(nameUpdate) formData.set("name" , nameUpdate);
     if(priceUpdate) formData.set("price" , priceUpdate.toString());
     if(stockUpdate) formData.set("stock" , stockUpdate.toString());
     if(categoryUpdate) formData.set("category" , categoryUpdate);
     if(photoFile) formData.set("photo" , photoFile);

     try{
       const res= await updateProduct({user_id:user?._id!, product_id:id! , formData});
       responseToast(res , navigate , "/admin/product")
     }catch(error){
       toast.error("Something went wrong");
     }
  };

  const deleteHandler = async () => {
     try{
       const res= await deleteProduct({user_id:user?._id!, product_id:id!});
       responseToast(res , navigate , "/admin/product")
     }catch(error){
       toast.error("Something went wrong");
     }
  };
  

  useEffect(() => {
    if (data?.product) {
      setProduct(data.product);
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setPhotoUpdate(`${import.meta.env.VITE_SERVER_URL}/${data.product.photo}`);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - {product._id}</strong>
          <img src={`${import.meta.env.VITE_SERVER_URL}/${photo}`} alt="Product" />
          <p>{product.name}</p>
          {product.stock > 0 ? (
            <span className="green">{product.stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{product.price}</h3>
        </section>
        <article>
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button type="submit">Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
