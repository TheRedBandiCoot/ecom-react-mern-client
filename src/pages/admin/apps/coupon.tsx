import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Table as TanstackTable } from '../../../components/admin/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery
} from '../../../redux/api/couponAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import toast from 'react-hot-toast';
import { CustomError } from '../../../types/types';
import Loader from '../../../components/Loader';
import { responseToast } from '../../../utils/features';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const allNumbers = '1234567890';
const allSymbols = '!@#$%^&*()_+';

type DataType = {
  code: string;
  amount: number;
  action: ReactElement;
};
const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('code', {
    cell: info => info.getValue(),
    header: () => <span>Coupon</span>,
    sortingFn: 'alphanumeric'
  }),
  columnHelper.accessor('amount', {
    cell: info => info.getValue(),
    header: () => <span>Amount</span>
  }),
  columnHelper.accessor('action', {
    cell: info => info.getValue(),
    header: () => <span>Action</span>
  })
];

const Coupon = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    data: couponsData,
    isLoading,
    isError,
    error
  } = useGetAllCouponsQuery(user?._id!);
  const [createCoupon] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const navigate = useNavigate();

  const [data, setData] = useState<DataType[]>([]);
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>('');
  const [couponAmount, setCouponAmount] = useState<string>('');
  const [coupon, setCoupon] = useState<string>('');
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [disabledCoupon, setDisabledCoupon] = useState<boolean>(false);
  const [isDeleteCouponLoading, setIsDeleteCouponLoading] =
    useState<boolean>(false);
  const couponAmountInputRef = useRef<HTMLInputElement | null>(null);

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const deleteCouponHandler = async (id: string) => {
    setIsDeleteCouponLoading(true);
    try {
      const res = await deleteCoupon({ couponId: id, userId: user?._id! });
      responseToast({ res, navigate, url: '.' });
      setTimeout(() => {
        setIsDeleteCouponLoading(false);
      }, 500);
    } catch (error) {
      setIsDeleteCouponLoading(false);
      toast.error('Cannot Delete, Something Went Wrong');
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return alert('Please Select One At Least');

    let result: string = prefix || '';
    const loopLength: number = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = '';
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum: number = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result);
  };

  function reset() {
    setSize(8);
    setPrefix('');
    setCouponAmount('');
    setIncludeNumbers(false);
    setIncludeCharacters(false);
    setIncludeSymbols(false);
    setIsCopied(false);
    setCoupon('');
    setDisabledCoupon(false);
  }

  const onSubmitCoupon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!couponAmount || !coupon) return toast.error('Please Enter All Fields');
    try {
      setDisabledCoupon(true);
      const body = {
        coupon,
        amount: Number(couponAmount)
      };
      const res = await createCoupon({ id: user?._id!, body });
      responseToast({ res, navigate, url: '.' });
      reset();
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  useEffect(() => {
    if (coupon) couponAmountInputRef.current?.focus();
    setIsCopied(false);
  }, [coupon]);
  // useEffect(() => {
  // }, [coupon]);

  useEffect(() => {
    if (couponsData) {
      setData(
        couponsData.coupons.map(i => ({
          amount: i.amount,
          code: i.code,
          action: (
            <button onClick={() => deleteCouponHandler(i._id)}>
              <FaTrash />
            </button>
          )
        }))
      );
    }
  }, [couponsData]);

  const pageSize = 3;

  const Table = TanstackTable<DataType, ColumnDef<DataType, any>[]>(
    data,
    columns
  )('coupon', pageSize, data.length > pageSize);

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container coupon">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>Coupon</h1>
            <section id="coupon-flex">
              {isDeleteCouponLoading ? <Loader /> : <>{Table}</>}
              <section className="coupon-main">
                <form className="coupon-form" onSubmit={submitHandler}>
                  <input
                    type="text"
                    placeholder="Text to include"
                    value={prefix}
                    onChange={e => setPrefix(e.target.value)}
                    maxLength={size}
                  />

                  <input
                    type="number"
                    placeholder="Coupon Length"
                    value={size}
                    onChange={e => setSize(Number(e.target.value))}
                    min={8}
                    max={25}
                  />

                  <fieldset>
                    <legend>Include</legend>

                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      id="numbers"
                      onChange={() => setIncludeNumbers(prev => !prev)}
                    />
                    <label htmlFor="numbers">Numbers</label>

                    <input
                      type="checkbox"
                      checked={includeCharacters}
                      id="characters"
                      onChange={() => setIncludeCharacters(prev => !prev)}
                    />
                    <label htmlFor="characters">Characters</label>

                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      id="symbols"
                      onChange={() => setIncludeSymbols(prev => !prev)}
                    />
                    <label htmlFor="symbols">Symbols</label>
                  </fieldset>
                  <button type="submit">Generate</button>
                </form>

                {coupon && (
                  <>
                    <code>
                      {coupon}{' '}
                      <span onClick={() => copyText(coupon)}>
                        {isCopied ? 'Copied' : 'Copy'}
                      </span>{' '}
                    </code>
                    <form
                      onSubmit={onSubmitCoupon}
                      className="coupon-amount-form"
                    >
                      <input
                        type="number"
                        ref={couponAmountInputRef}
                        placeholder="Enter Amount"
                        className="coupon-input"
                        value={couponAmount}
                        onChange={e => setCouponAmount(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={couponAmount.length < 1 || disabledCoupon}
                        className="coupon-btn"
                      >
                        {disabledCoupon ? 'Creating...' : 'Create Coupon'}
                      </button>
                    </form>
                  </>
                )}
              </section>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Coupon;
