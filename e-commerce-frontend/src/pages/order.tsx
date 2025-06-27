import TableHOC from "../components/admin/TableHOC";
import { useEffect, useState, type ReactElement } from "react";
import type { Column } from "react-table";
import {Link} from "react-router-dom";
import { useSelector } from "react-redux";
import type { userReducerInitialStateTypes } from "../types/user-reducer";
import { useMyordersQuery } from "../redux/api/order-api";
import type { CustomError } from "../types/types";
import toast from "react-hot-toast";
import Skeleton from "../components/skeleton";

type DataType={ 
    _id:string;
    amount:number;
    quantity:number;
    discount:number;
    status:ReactElement;
    action:ReactElement;
};

const column:Column<DataType>[]=[
    {
    Header:"ID",
    accessor:"_id", 
   },{
    Header:"Amount",
    accessor:"amount", 
   },{
    Header:"Quantity",
    accessor:"quantity", 
   },{
    Header:"Discount",
    accessor:"discount", 
   },{
    Header:"Status",
    accessor:"status", 
   },{
    Header:"Action", 
    accessor:"action", 
   }
];
const Order = () => {
     const [rows ,setrows ] = useState<DataType[]>([]);
     const {user}= useSelector((state : {userReducer:userReducerInitialStateTypes})=>state.userReducer);
    const {data , isLoading , isError , error} =useMyordersQuery(user?._id!);
    if(isError){
        toast.error((error as CustomError).data.message);
    }
    useEffect(()=>{
       if(data){
        setrows(data.orders.map((i)=>(
            {
                _id:i._id,
                amount:i.totalAmount,
                quantity:i.orderItems.length,
                discount:i.discount,
                status: (<span className={i.status==="pending"?"red":i.status==="shipped"?"green":"purple"}>{i.status}</span>),
                action: (<Link to={`/admin/transaction/${i._id}`}>View</Link>)
            }
        )))
       }
    },[data])

    const Table=TableHOC<DataType>(
        column, rows , "dashboard-product-box" , "Orders" , rows.length>6
    )();
  return (
    <div className="container">
      <h1> My Orders</h1>
      {isLoading ? <Skeleton/> : Table}
    </div>
  )
}

export default Order;

