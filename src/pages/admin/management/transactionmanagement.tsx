import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '../../../components/Loader';
import { Modal } from '../../../components/Modal';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation
} from '../../../redux/api/orderAPI';
import { openBtn } from '../../../redux/reducer/modalReducer';
import { RootState } from '../../../redux/store';
import { CustomError, Order, OrderItem } from '../../../types/types';
import { responseToast } from '../../../utils/features';
import { refetchOrder } from '../../../redux/reducer/cartReducer';

const defaultOrder: Order = {
  shippingInfo: {
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  },
  status: 'Processing',
  subTotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  _id: '',
  user: {
    _id: '',
    name: '',
    email: ''
  }
};

const TransactionManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { value } = useSelector((state: RootState) => state.modalReducer);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: orderDetails,
    isLoading,
    isError: orderDetailIsError,
    error
  } = useOrderDetailsQuery(id!);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const {
    shippingInfo: { address, city, state, country, pinCode },
    discount,
    shippingCharges,
    subTotal,
    status,
    tax,
    orderItems,
    total,
    user: { email, name }
  } = orderDetails?.order || defaultOrder;

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: orderDetails?.order._id!
    });
    dispatch(refetchOrder({ isTransactionRefetch: true }));
    responseToast({ res, navigate, url: '..', relative: 'path' });
  };

  const deleteHandler = () => {
    dispatch(openBtn());
  };

  const res = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: orderDetails?.order._id!
    });
    return res;
  };

  if (orderDetailIsError) {
    toast.error(`${(error as CustomError).data.message}`);
    return <Navigate to={`/404`} />;
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {value && (
          <Modal
            name={{
              title: 'Order',
              orderName: orderDetails?.order.orderItems.map(
                (i, idx) => `${idx + 1}. ${i.name} `
              )!
            }}
            res={res}
          />
        )}
        {isLoading ? (
          <Skeleton length={10} />
        ) : (
          <>
            <section
              style={{
                padding: '2rem'
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map(i => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={i.photo}
                  productID={i.productID}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>
                Address:{' '}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subTotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{' '}
                <span
                  className={
                    status === 'Delivered'
                      ? 'purple'
                      : status === 'Shipped'
                      ? 'green'
                      : 'red'
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productID
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productID}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
