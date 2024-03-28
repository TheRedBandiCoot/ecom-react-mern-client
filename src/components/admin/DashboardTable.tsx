import { Table } from './Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}
const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('_id', {
    cell: info => info.getValue(),
    header: () => <span>ID</span>
  }),
  columnHelper.accessor(row => row.quantity, {
    id: 'quantity',
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
  })
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  const pageSize = 6;
  return Table<DataType, ColumnDef<DataType, any>[]>(data, columns)(
    'Top Transactions',
    pageSize,
    data.length > pageSize
  );
};

export default DashboardTable;
