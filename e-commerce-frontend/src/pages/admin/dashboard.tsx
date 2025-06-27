import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useGetDashboardDataQuery } from "../../redux/api/dashboard-api";
import toast from "react-hot-toast";
import type { CustomError } from "../../types/types";
import Loader from "../../components/admin/Loader";
import ErrorBoundary from "../../components/ErrorBoundary";
import Skeleton from "../../components/skeleton";

const img1= "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg";
const img2= "https://img.freepik.com/premium-vector/woman-avatar-profile-picture-isolated-background-avatar-profile-picture-woman_1293239-4842.jpg";
 
const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useGetDashboardDataQuery(user?._id!);

  if (isError) {
    const errorMessage = (error as CustomError).data?.message || "Something went wrong";
    toast.error(errorMessage);
    return <div>Error: {errorMessage}</div>;
  }

  if (!data?.stats) {
    return <div>No dashboard data available</div>;
  }

  const stats = data.stats;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? <Skeleton/> : <> 
          <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img src={user?.photo || (user?.gender === "male" ? img1 : img2)} alt="User" />
        </div>

        <section className="widget-container">
          <WidgetItem
            percent={stats.changePercentage.revenuePercentage}
            amount={true}
            value={stats.Revenue}
            heading="Revenue"
            color="rgb(0, 115, 255)"
          />
          <WidgetItem
            percent={stats.changePercentage.UserPercentage}
            value={stats.count.users}
            color="rgb(0 198 202)"
            heading="Users"
          />
          <WidgetItem
            percent={stats.changePercentage.OrderPercentage}
            value={stats.count.orders}
            color="rgb(255 196 0)"
            heading="Transactions"
          />
          <WidgetItem
            percent={stats.changePercentage.ProductPercentage}
            value={stats.count.products}
            color="rgb(76 0 255)"
            heading="Products"
          />
        </section>

        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Revenue & Transaction</h2>
            {stats.sixMonthOrderRevenue && stats.sixMonthOrderCount && (
              <BarChart
                data_2={stats.sixMonthOrderRevenue}
                data_1={stats.sixMonthOrderCount}
                title_1="Revenue"
                title_2="Transaction"
                bgColor_1="rgb(0, 115, 255)"
                bgColor_2="rgba(53, 162, 235, 0.8)"
              />
            )}
          </div>

          <div className="dashboard-categories">
            <h2>Inventory</h2>
            <div>
              {stats.categoriesCount?.map((i: Record<string, number>) => {
                const [heading, value] = Object.entries(i)[0];
                return (
                  <CategoryItem
                    key={heading}
                    value={value}
                    heading={heading}
                    color={`hsl(${value * 4}, 50%, 50%)`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            {stats.ratio && (
              <DoughnutChart
                labels={["Female", "Male"]}
                data={[stats.ratio.female, stats.ratio.male]}
                backgroundColor={[
                  "hsl(340, 82%, 56%)",
                  "rgba(53, 162, 235, 0.8)",
                ]}
                cutout={90}
              />
            )}
            <p>
              <BiMaleFemale />
            </p>
          </div>
          {stats.modifiedLatestTransaction && (
            <Table data={stats.modifiedLatestTransaction} />
          )}
        </section>
        </>}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent > 10000 ? "9999+%": percent < -10000 ? "-9999%" : `${percent}%`}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default function DashboardWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
