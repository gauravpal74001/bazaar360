import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGetPieChartDataQuery } from "../../../redux/api/dashboard-api";
import type { CustomError } from "../../../types/types";
import toast from "react-hot-toast";
import ErrorBoundary from "../../../components/ErrorBoundary";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useGetPieChartDataQuery(user?._id!);

  

  if (isError) {
    const errorMessage = (error as CustomError).data?.message || "Error fetching data";
    toast.error(errorMessage);
    return <div>Error: {errorMessage}</div>;
  }

  if (!data?.charts) {
    return <div>No chart data available</div>;
  }

  const {
    fullfillment,
    categoryCount,
    stockAvailablity,
    RevenueDistribution,
    AdminsAndCustomers,
    UserAgeGroup
  } = data.charts;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        
        {fullfillment && (
          <section>
            <div>
              <PieChart
                labels={["Processing", "Shipped", "Delivered"]}
                data={[
                  fullfillment.processOrder || 0,
                  fullfillment.shippedOrder || 0,
                  fullfillment.deliveredOrder || 0
                ]}
                backgroundColor={[
                  `hsl(110,80%, 80%)`,
                  `hsl(110,80%, 50%)`,
                  `hsl(110,40%, 50%)`,
                ]}
                offset={[0, 0, 50]}
              />
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>
        )}

        {categoryCount && categoryCount.length > 0 && (
          <section>
            <div>
              <DoughnutChart
                labels={categoryCount.map((i) => Object.keys(i)[0])}
                data={categoryCount.map((i) => Object.values(i)[0])}
                backgroundColor={categoryCount.map(
                  (i) => `hsl(${Object.values(i)[0] * 4}, ${Object.values(i)[0]}%, 50%)`
                )}
                legends={false}
                offset={[0, 0, 0, 80]}
              />
            </div>
            <h2>Product Categories Ratio</h2>
          </section>
        )}

        {stockAvailablity && (
          <section>
            <div>
              <DoughnutChart
                labels={["In Stock", "Out Of Stock"]}
                data={[
                  stockAvailablity.inStock || 0,
                  stockAvailablity.outOfStock || 0
                ]}
                backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                legends={false}
                offset={[0, 80]}
                cutout={"70%"}
              />
            </div>
            <h2>Stock Availability</h2>
          </section>
        )}

        {RevenueDistribution && (
          <section>
            <div>
              <DoughnutChart
                labels={[
                  "Marketing Cost",
                  "Discount",
                  "Burnt",
                  "Production Cost",
                  "Net Margin",
                ]}
                data={[
                  RevenueDistribution.marketingCost || 0,
                  RevenueDistribution.discount || 0,
                  RevenueDistribution.burnt || 0,
                  RevenueDistribution.productionCost || 0,
                  RevenueDistribution.NetMargin || 0
                ]}
                backgroundColor={[
                  "hsl(110,80%,40%)",
                  "hsl(19,80%,40%)",
                  "hsl(69,80%,40%)",
                  "hsl(300,80%,40%)",
                  "rgb(53, 162, 255)",
                ]}
                legends={false}
                offset={[20, 30, 20, 30, 80]}
              />
            </div>
            <h2>Revenue Distribution</h2>
          </section>
        )}

        {UserAgeGroup && (
          <section>
            <div>
              <PieChart
                labels={[
                  "Teenager(Below 20)",
                  "Adult (20-40)",
                  "Older (above 40)",
                ]}
                data={[
                  UserAgeGroup.teen || 0,
                  UserAgeGroup.adult || 0,
                  UserAgeGroup.senior || 0
                ]}
                backgroundColor={[
                  `hsl(10, 80%, 80%)`,
                  `hsl(10, 80%, 50%)`,
                  `hsl(10, 40%, 50%)`,
                ]}
                offset={[0, 0, 50]}
              />
            </div>
            <h2>Users Age Group</h2>
          </section>
        )}

        {AdminsAndCustomers && (
          <section>
            <div>
              <DoughnutChart
                labels={["Admin", "Customers"]}
                data={[
                  AdminsAndCustomers.admins || 0,
                  AdminsAndCustomers.customers || 0
                ]}
                backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                offset={[0, 50]}
              />
            </div>
            <h2>Admins & Customers</h2>
          </section>
        )}
      </main>
    </div>
  );
};

export default function PieChartsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <PieCharts />
    </ErrorBoundary>
  );
}
