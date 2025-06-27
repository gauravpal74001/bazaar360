import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/loader.tsx";
import Header from "./components/header.tsx";
import Login from "./pages/login.tsx";
import Order from "./pages/order.tsx";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.ts";
import { getUser } from "./redux/api/user-api.ts";
import { userExist, userNotExist } from "./redux/reducer/userReducer.ts";
import { useDispatch, useSelector } from "react-redux";
import type { userReducerInitialStateTypes } from "./types/user-reducer.ts";
import ProtectedRoutes from "./components/protected-routes.tsx";
import { Navigate } from "react-router-dom";
import Checkout from "./pages/checkout.tsx";  



const Search = lazy(() => import("./pages/search"));
const Home = lazy(() => import("./pages/home"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));


//admin routes
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);
const Notfound =lazy(()=>import("./pages/not-found"));


const App = () => {
  const dispatch = useDispatch();
  const { user, isloading } = useSelector(
    (state: { userReducer: userReducerInitialStateTypes }) => state.userReducer
  );

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("user is logged in");
          const data = await getUser(user.uid);
          dispatch(userExist(data.user));
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(userNotExist());
        }
      } else {
        console.log("user is logged out");
        dispatch(userNotExist());
      }
    });
  }, []);

  return isloading ? (
    <Loader />
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Login route - accessible when not logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoutes isauthnticated={Boolean(user)} />}>
            <Route path="/orders" element={<Order />} />
            <Route path="/shipping" element={<Shipping />} />
             <Route path="/pay" element={<Checkout/>} /> 
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoutes
                isauthnticated={Boolean(user)}
                adminOnly={true}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route
              path="/admin/product/management"
              element={<ProductManagement />}
            />
            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
            <Route
              path="/admin/transaction/management"
              element={<TransactionManagement />}
            />
          </Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
