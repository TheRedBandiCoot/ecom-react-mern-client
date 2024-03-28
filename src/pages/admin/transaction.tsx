import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/Loader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Table as TanstackTable } from '../../components/admin/Table';
import { useAllOrderQuery } from '../../redux/api/orderAPI';
import { RootState } from '../../redux/store';
import { CustomError } from '../../types/types';

type DataType = {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
};

const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('user', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
    sortingFn: 'alphanumeric'
  }),
  columnHelper.accessor('amount', {
    cell: info => info?.getValue(),
    header: () => <span>Amount</span>
  }),
  //@  you can use different approach here
  columnHelper.accessor('discount', {
    cell: info => info.getValue(),
    header: () => <span>Discount</span>
  }),
  columnHelper.accessor(row => row.quantity, {
    id: 'quantity',
    cell: info => info.getValue(),
    header: () => <span>Quantity</span>
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

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    data: ordersData,
    isLoading,
    isError,
    error
  } = useAllOrderQuery(user?._id!);
  const [data, setData] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  const pageSize = 6;

  const Table = TanstackTable<DataType, ColumnDef<DataType, any>[]>(
    data,
    columns
  )('Transactions', pageSize, data.length > pageSize);

  useEffect(() => {
    if (ordersData) {
      setData(
        ordersData.orders.map(i => ({
          amount: i.total,
          discount: i.discount,
          user: i.user.name,
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
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
          quantity: i.orderItems.length
        }))
      );
    }
  }, [ordersData]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={3} /> : Table}</main>
    </div>
  );
};

export default Transaction;
