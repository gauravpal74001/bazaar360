import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { cartReducerInitialStateTypes } from "../types/user-reducer";
import { toast } from "react-hot-toast";
import { useNewPaymentMutation } from "../redux/api/payment-api";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newPayment] = useNewPaymentMutation();
  
  const [shippinginfo, setShippinginfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: ""
  });

  const { cartitems, total } = useSelector(
    (state: { cartReducer: cartReducerInitialStateTypes }) => state.cartReducer
  );

  useEffect(() => {
    if (cartitems.length === 0) {
      navigate("/cart");
    }
  }, [cartitems, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippinginfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate shipping info
    if (!shippinginfo.address || !shippinginfo.city || !shippinginfo.state || 
        !shippinginfo.country || !shippinginfo.pinCode) {
      toast.error("Please fill all shipping details");
      return;
    }

    if (!total || total <= 0) {
      toast.error("Invalid order total");
      return;
    }

    // Save shipping info to Redux
    dispatch(saveShippingInfo(shippinginfo));

    try {
      // Create payment using RTK Query
      const result = await newPayment({ amount: Number(total) }).unwrap();

      if (!result.success || !result.order) {
        throw new Error("Payment creation failed");
      }

      navigate("/pay", {
        state: {
          cartitems,
          shippingInfo: shippinginfo,
          order: result.order,
        },
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment"
      );
    }
  };

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Shipping Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippinginfo.address}
          onChange={handleChange}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippinginfo.city}
          onChange={handleChange}
        />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippinginfo.state}
          onChange={handleChange}
        />
        <select
          required
          name="country"
          value={shippinginfo.country}
          onChange={handleChange}
        >
          <option value="">Choose Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="New Zealand">New Zealand</option>
        </select>
        <input
          required
          type="text"
          placeholder="PIN Code"
          name="pinCode"
          value={shippinginfo.pinCode}
          onChange={handleChange}
        />
        <button type="submit" className="pay-btn">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default Shipping; 
