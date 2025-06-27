import  { useState , type ReactElement } from "react";
import { Link } from "react-router-dom";
import type { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import type { userReducerInitialStateTypes } from "../../types/user-reducer";
import { useAdminOrdersQuery } from "../../redux/api/order-api";
import toast from "react-hot-toast";
import type { CustomError } from "../../types/types";
import { useEffect } from "react";
import Skeleton from "../../components/skeleton";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const {user}= useSelector((state:{userReducer:userReducerInitialStateTypes})=>state.userReducer);
  const { data , isLoading  , isError , error} = useAdminOrdersQuery(user?._id!);

  if(isError){
    toast.error((error as CustomError).data.message);
  }


  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          user: i.user.name,
          amount: i.totalAmount,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "pending"
                  ? "red"
                  : i.status === "shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
        }))
      );
    }
  }, [data]);
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton/> : Table}</main>
    </div>
  );
};

export default Transaction;
