import { useSelector } from 'react-redux';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { LineChart } from '../../../components/admin/Charts';
import { getLastMonths } from '../../../utils/features';
import { RootState } from '../../../redux/store';
import { useLineQuery } from '../../../redux/api/dashboardAPI';
import toast from 'react-hot-toast';
import { CustomError } from '../../../types/types';
import { Skeleton } from '../../../components/Loader';

const { last12Months: months } = getLastMonths();

const Linecharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useLineQuery(user?._id!);

  const products = data?.charts.products || [];
  const discount = data?.charts.discount || [];
  const users = data?.charts.users || [];
  const revenue = data?.charts.revenue || [];

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleton length={10} />
        ) : (
          <>
            <h1>Line Charts</h1>
            <section>
              <LineChart
                data={users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={months}
                backgroundColor="rgba(53, 162, 255, 0.5)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={products}
                backgroundColor={'hsla(269,80%,40%,0.4)'}
                borderColor={'hsl(269,80%,40%)'}
                labels={months}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={revenue}
                backgroundColor={'hsla(129,80%,40%,0.4)'}
                borderColor={'hsl(129,80%,40%)'}
                label="Revenue"
                labels={months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={discount}
                backgroundColor={'hsla(29,80%,40%,0.4)'}
                borderColor={'hsl(29,80%,40%)'}
                label="Discount"
                labels={months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Linecharts;
