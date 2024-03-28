import { ReactElement, useEffect, useState } from 'react';
import { Table as TanstackTable } from '../components/admin/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMyOrderQuery } from '../redux/api/orderAPI';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CustomError } from '../types/types';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/Loader';
import { RootState } from '../redux/store';

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('_id', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
    sortingFn: 'alphanumeric'
  }),
  columnHelper.accessor(row => row.quantity, {
    id: 'stock',
    cell: info => info.getValue(),
    header: () => <span>Quantity</span>
  }),
  columnHelper.accessor('discount', {
    cell: info => info.getValue(),
    header: () => <span>Discount</span>
  }),
  columnHelper.accessor('amount', {
    cell: info => info?.getValue(),
    header: () => <span>Amount</span>
  }),
  columnHelper.accessor('status', {
    cell: info => info?.getValue(),
    header: () => <span>Status</span>
  }),
  columnHelper.accessor('action', {
    cell: info => <span className="action">{info.getValue()}</span>,
    header: () => <span>Action</span>
  })
];
const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    data: ordersData,
    isLoading,
    isError,
    error
  } = useMyOrderQuery(user?._id!);

  const { isProductRefetch } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const [data, setData] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  const pageSize = 6;

  const Table = TanstackTable<DataType, ColumnDef<DataType, any>[]>(
    data,
    columns
  )('Orders', pageSize, data.length > pageSize);

  useEffect(() => {
    console.log(isProductRefetch);

    if (ordersData) {
      setData(
        ordersData.orders.map(i => ({
          amount: i.total,
          _id: i._id,
          discount: i.discount,
          status: (
            <span
              className={
                i.status === 'Processing'
                  ? 'red'
                  : i.status === 'Shipped'
                  ? 'green'
                  : 'purple'
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/order/${i._id}`}>View</Link>,
          quantity: i.orderItems.length
        }))
      );
    }
  }, [ordersData, isProductRefetch]);

  return (
    <div className="container">
      {data.length < 1 ? (
        <>{isLoading ? <Skeleton length={3} /> : <h1>no orders</h1>}</>
      ) : (
        <>
          <h1>My Orders</h1>
          {isLoading ? <Skeleton length={3} /> : Table}
        </>
      )}
    </div>
  );
};

export default Orders;
