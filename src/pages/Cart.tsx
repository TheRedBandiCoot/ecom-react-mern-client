import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { VscError } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import CartItems from '../components/CartItems';
import Loader from '../components/Loader';
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem
} from '../redux/reducer/cartReducer';
import { RootState, server } from '../redux/store';
import { CouponOnErrorResponse, CouponResponse } from '../types/api-types';
import { CartItem } from '../types/types';
import { INRCurrency } from '../utils/INRCurrency';

const Cart = () => {
  const { cartItems, subTotal, tax, shippingCharges, discount, total } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>('');
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const incrementQuantityHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementQuantityHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeItemHandler = (productID: string) => {
    dispatch(removeCartItem(productID));
    toast.error('Removed Item From Cart');
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    if (couponCode.length < 1) {
      dispatch(discountApplied(0));
      dispatch(calculatePrice());
    }

    if (couponCode) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        axios
          .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
            cancelToken
          })
          .then((res: AxiosResponse<CouponResponse>) => {
            const discount = res.data.discount;
            dispatch(discountApplied(discount));
            dispatch(calculatePrice());
            setIsValidCouponCode(res.data.success);
          })
          .catch((err: AxiosError<CouponOnErrorResponse>) => {
            dispatch(discountApplied(0));
            dispatch(calculatePrice());
            setIsValidCouponCode(err.response?.data.success!);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        cancel();
        setIsLoading(false);
        setIsValidCouponCode(false);
      };
    }
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((cartItem, index) => (
            <CartItems
              key={index}
              cartItem={cartItem}
              decrementQuantityHandler={decrementQuantityHandler}
              incrementQuantityHandler={incrementQuantityHandler}
              removeItemHandler={removeItemHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>

      {cartItems.length > 0 && (
        <aside>
          <p>Subtotal : {INRCurrency.format(subTotal)}</p>
          <p>Shipping Charges : {INRCurrency.format(shippingCharges)}</p>
          <p>Tax : {INRCurrency.format(tax)}</p>
          <p>
            Discount: <em className="red"> - {INRCurrency.format(discount)}</em>
          </p>
          <p>
            <b>Total : {INRCurrency.format(total)}</b>
          </p>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
          />

          {isLoading ? (
            <Loader textAlign="center" clsName="loader-cart" />
          ) : couponCode && isValidCouponCode ? (
            <span className="green">
              {INRCurrency.format(discount)} off using the{' '}
              <code>{couponCode}</code>
            </span>
          ) : couponCode ? (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ) : null}

          {cartItems.length > 0 && <NavLink to="/shipping">Checkout</NavLink>}
        </aside>
      )}
    </div>
  );
};

export default Cart;
