//@ 4000 0035 6000 0123
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../redux/api/orderAPI';
import { refetchProduct, resetCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { responseToast } from '../utils/features';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={'/'} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

const CheckoutForm = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    cartItems,
    shippingInfo,
    subTotal,
    tax,
    total,
    discount,
    shippingCharges
  } = useSelector((state: RootState) => state.cartReducer);

  const [createOrder] = useCreateOrderMutation();

  const orderData: NewOrderRequest = {
    shippingInfo,
    subTotal,
    total,
    tax,
    user: user?._id!,
    discount,
    shippingCharges,
    orderItems: cartItems
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin
      },
      redirect: 'if_required'
    });

    if (error) {
      setIsProcessing(false);
      console.log(error.message);

      return toast.error(error.message || 'Something Went Wrong');
    }

    if (paymentIntent?.status === 'succeeded') {
      const res = await createOrder(orderData);
      dispatch(resetCart());
      dispatch(
        refetchProduct({ isStatsRefetch: true, isProductRefetch: true })
      );
      responseToast({ res, navigate, url: '/orders' });
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
};
