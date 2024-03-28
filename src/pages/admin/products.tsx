import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/Loader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Table as TanstackTable } from '../../components/admin/Table';
import { useAllProductsQuery } from '../../redux/api/productAPI';
import { RootState, server } from '../../redux/store';
import { CustomError } from '../../types/types';
import { refetchProduct } from '../../redux/reducer/cartReducer';

type DataType = {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
};
const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('photo', {
    cell: info => info?.getValue(),
    // cell: info => (
    //   <img src={String(info?.getValue())} alt="..." className="img-table" />
    // ),
    header: () => <span>Photo</span>
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
    sortingFn: 'alphanumeric'
  }),
  //@  you can use different approach here
  columnHelper.accessor('price', {
    cell: info => info.getValue(),
    header: () => <span>Price</span>
  }),
  columnHelper.accessor(row => row.stock, {
    id: 'stock',
    cell: info => info.getValue(),
    header: () => <span>Stock</span>
  }),
  columnHelper.accessor('action', {
    cell: info => <span className="action">{info.getValue()}</span>,
    header: () => <span>Action</span>
  })
];

const Products = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isProductRefetch } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const dispatch = useDispatch();

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch
  } = useAllProductsQuery(user?._id!);
  const [data, setData] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    console.log(isProductRefetch);

    if (isProductRefetch) refetch();
    dispatch(refetchProduct({ isProductRefetch: false }));
    if (productsData) {
      setData(
        productsData.products.map(product => ({
          photo: (
            <img
              src={`${server}/${product.photo}`}
              className="img-table"
              alt={product.name}
            />
          ),
          name: product.name,
          price: product.price,
          stock: product.stock,
          action: <Link to={`/admin/product/${product._id}`}>Manage</Link>
        }))
      );
    }
  }, [productsData, isProductRefetch]);

  const pageSize = 6;

  // const Table = _<DataType>(data, pageSize, data.length > pageSize)();
  const Table = TanstackTable<DataType, ColumnDef<DataType, any>[]>(
    data,
    columns
  )('Products', pageSize, data.length > pageSize);

  // console.log(loadData);
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>{isLoading ? <Skeleton length={3} /> : Table}</main>

      {!isLoading && (
        <Link to="/admin/product/new" className="create-product-btn">
          <FaPlus />
        </Link>
      )}
    </div>
  );
};

export default Products;
