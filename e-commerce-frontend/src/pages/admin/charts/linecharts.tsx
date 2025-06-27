import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useGetLineChartDataQuery } from "../../../redux/api/dashboard-api";
import { getMonthsData } from "../../../utils/features";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import Skeleton from "../../../components/skeleton";
import type { CustomError } from "../../../types/types";

const { gettwelveMonths } = getMonthsData();

const Linecharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useGetLineChartDataQuery(user?._id!);

  if (isLoading) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <main className="chart-container">
          <Skeleton />
        </main>
      </div>
    );
  }

  if (isError) {
    const errorMessage = (error as CustomError).data?.message || "Error fetching data";
    toast.error(errorMessage);
    return <Navigate to="/admin/dashboard" />;
  }

  if (!data?.charts) {
    toast.error("No chart data available");
    return <Navigate to="/admin/dashboard" />;
  }

  const {
    productsCount = [],
    usersCount = [],
    revenue = [],
    discount = [],
  } = data.charts;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={usersCount}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={gettwelveMonths}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={productsCount}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={gettwelveMonths}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={revenue}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={gettwelveMonths}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={gettwelveMonths}
          />
          <h2>Discount Allotted </h2>
        </section>
      </main>
    </div>
  );
};

export default Linecharts;
