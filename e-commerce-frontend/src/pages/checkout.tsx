import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/order-api";
import { useNewPaymentMutation } from "../redux/api/payment-api";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import type { newOrderRequestType } from "../types/types";
import type { cartReducerInitialStateTypes, userReducerInitialStateTypes } from "../types/user-reducer";
import type { RootState } from "../redux/store";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const location = useLocation();
  const { cartitems, shippingInfo } = location.state || {};
  
  if (!cartitems?.length || !shippingInfo) {
    return <Navigate to="/shipping" />;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [newOrder] = useNewOrderMutation();
  const [createPayment] = useNewPaymentMutation();

  const orderData: newOrderRequestType = {
    shippingInfo,
    orderItems: cartitems,
    subTotal: subtotal,
    tax,
    discount,
    shippingCharges,
    totalAmount: total,
    status: "processing",
    user: user?._id!
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsProcessing(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      // Create payment order using RTK Query
      const { data: paymentData } = await createPayment({ amount: total });
      if (!paymentData?.order) {
        toast.error("Error creating payment");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY!,
        amount: paymentData.order.amount,
        currency: "INR",
        name: "E-Commerce Store",
        description: "Payment for your order",
        order_id: paymentData.order.id,
        handler: async () => {
          try {
            const result = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(result, navigate, "/orders");
          } catch (error) {
            toast.error("Error creating order");
            console.error("Order creation error:", error);
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: ""
        },
        theme: {
          color: "#2563eb"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <form onSubmit={submitHandler}>
        <h2>Order Summary</h2>
        <div className="checkout-details">
          <div className="checkout-item">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="checkout-item">
            <span>Tax:</span>
            <span>₹{tax}</span>
          </div>
          <div className="checkout-item">
            <span>Shipping:</span>
            <span>₹{shippingCharges}</span>
          </div>
          <div className="checkout-item">
            <span>Discount:</span>
            <span>-₹{discount}</span>
          </div>
          <div className="checkout-total">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isProcessing}
          className="checkout-btn"
        >
          {isProcessing ? "Processing..." : `Pay ₹${total}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
