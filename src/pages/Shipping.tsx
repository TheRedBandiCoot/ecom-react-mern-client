import axios, { AxiosError, AxiosResponse } from 'axios';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../redux/reducer/cartReducer';
import { RootState, server } from '../redux/store';

const Shipping = () => {
  const { total: amount } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  type MessageResponse = {
    success: boolean;
    clientSecret: string;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data }: { data: MessageResponse } = await axios.post<
        {},
        AxiosResponse<any, any>,
        { amount?: number }
      >(
        `${server}/api/v1/payment/create`,
        {
          amount
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/pay', { state: data.clientSecret });
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      toast.success(response!.data.message || 'Something Went Wrong');
    }
  };

  return (
    <div className="shipping">
      <button
        className="back-btn"
        onMouseOver={() => setTimeout(() => navigate('/cart'), 300)}
      >
        <BiArrowBack />
      </button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          required
          onChange={changeHandler}
          value={shippingInfo.address}
          placeholder="Address"
          name="address"
        />
        <input
          type="text"
          required
          onChange={changeHandler}
          value={shippingInfo.city}
          placeholder="City"
          name="city"
        />
        <input
          type="text"
          required
          onChange={changeHandler}
          value={shippingInfo.state}
          placeholder="State"
          name="state"
        />
        <select
          required
          value={shippingInfo.country}
          onChange={changeHandler}
          name="country"
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
        </select>
        <input
          type="number"
          required
          onChange={changeHandler}
          value={shippingInfo.pinCode}
          placeholder="Pin Code"
          name="pinCode"
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};
export default Shipping;
