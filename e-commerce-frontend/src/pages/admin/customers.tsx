import { useEffect, useState, type ReactElement } from "react";
import { FaTrash } from "react-icons/fa";
import type { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../../redux/api/user-api";
import { toast } from "react-hot-toast";
import Skeleton from "../../components/skeleton";
import type { User } from "../../types/types";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError } = useGetAllUsersQuery(user?._id!);

  if(isError){
    toast.error("Something went wrong");   return;
  }   
  const [deleteUser]=useDeleteUserMutation();
  
 const deleteHandler=async (id:string)=>{
    await deleteUser({user_id:id, admin_id:user?._id!});
    toast.success( "User deleted successfully");
 }

useEffect(() => {
  if (!data?.users) return;

  setRows(
    data.users.map((i) => ({
      avatar: (
        <img
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          src={i.photo || "https://via.placeholder.com/40"}
          alt={i.name}
        />
      ),
      name: i.name,
      email: i.email,
      gender: i.gender,
      role: i.role,
      action: (
        <button onClick={()=>deleteHandler(i._id)}>
          <FaTrash />
        </button>
      ),
    }))
  );
}, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton/> : Table}</main>
    </div>
  );
};

export default Customers;
