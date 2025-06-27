import { FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useState } from "react";
import type { Order, orderItems} from "../../../types/types"; 
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { userReducerInitialStateTypes } from "../../../types/user-reducer";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/order-api";
import { Navigate } from "react-router-dom";
import { responseToast } from "../../../utils/features";

const defaultOrder: Order ={
  shippingInfo : {
    address:"",
    city:"",
    country:"",
    state:"",
    pinCode:"",
  },
  _id:"",
  user:{
    name:"",
    _id:"",
  },
  subTotal:0,
  tax:0,
  shippingCharges:0,
  discount:0,
  totalAmount:0,
  status:"",
  orderItems: []
};

const TransactionManagement = () => {
  const [order, setOrder] = useState<Order>(defaultOrder);

  const {user}= useSelector((state:{userReducer:userReducerInitialStateTypes})=>state.userReducer);
  const {id}=useParams();
  const navigate=useNavigate();

  const {data  , isLoading  , isError}=useOrderDetailsQuery(id!);
  
  if(isError){
    return <Navigate to= {`/404`}/>;
  }

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  
  const updateHandler = async ()=> {
    const res = await updateOrder({
      order_id: data?.order._id!,
      user_id: user?._id!
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async ()=> {
    const res = await deleteOrder({
      order_id: data?.order._id!,
      user_id: user?._id!
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const {shippingCharges, tax, discount, totalAmount, status , orderItems, subTotal, shippingInfo :{address, city, state, country, pinCode}, user:{name}} =data?.order || defaultOrder;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {data?.order.orderItems.map((i) => ( 
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`${import.meta.env.VITE_SERVER_URL}/${i.photo}`}
              productId={i.productId}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {data?.order.user.name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subTotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p> 
          <p>Total: {totalAmount}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: orderItems) => (
  <div className="transaction-product-card">
    <img src={`${import.meta.env.VITE_SERVER_URL}/${photo}`} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
