import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { useGetBarChartDataQuery } from "../../../redux/api/dashboard-api";
import type { RootState } from "../../../redux/store";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMonthsData } from "../../../utils/features";
import Skeleton from "../../../components/skeleton";


const {getsixMonths, gettwelveMonths} = getMonthsData();

const Barcharts = () => {
  const {user} = useSelector((state:RootState) => state.userReducer);
  const {data, isLoading, isError} = useGetBarChartDataQuery(user?._id!);

  if(isError) {
    toast.error("Error fetching data");
    return <Navigate to="/admin/dashboard"/>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? <Skeleton/> : (
          <>
            <h1>Bar Charts</h1>
            {data?.charts && (
              <>
                <section>
                  <BarChart
                    data_2={data.charts.productsCount}
                    data_1={data.charts.usersCount}
                    title_1="Products"
                    title_2="Users"
                    bgColor_1={`hsl(260, 50%, 30%)`}
                    bgColor_2={`hsl(360, 90%, 90%)`}
                    labels={getsixMonths}
                  />
                  <h2>Top Products & Top Customers</h2>
                </section>

                <section>
                  <BarChart
                    horizontal={true}
                    data_1={data.charts.ordersCount}
                    data_2={[]}
                    title_1="Orders"
                    title_2=""
                    bgColor_1={`hsl(180, 40%, 50%)`}
                    bgColor_2=""
                    labels={gettwelveMonths}
                  />
                  <h2>Orders throughout the year</h2>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
