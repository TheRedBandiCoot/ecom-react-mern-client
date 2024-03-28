import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeBtn, closeBtnValue } from '../redux/reducer/modalReducer';
import { RootState } from '../redux/store';
import { MessageResponse } from '../types/api-types';
import { responseToast } from '../utils/features';
import { useState } from 'react';
import { refetchOrder } from '../redux/reducer/cartReducer';

type Order = {
  title: 'Order';
  orderName: string | string[];
};

type Product = {
  title: 'Product';
  productName: string;
};

type User = {
  title: 'User';
  userName: string;
};

type ModalType = {
  name: Product | Order | User;
  url?: string;
  res: () => Promise<
    | {
        data: MessageResponse;
      }
    | {
        error: FetchBaseQueryError | SerializedError;
      }
  >;
};

export function Modal({ name, res: response, url = '..' }: ModalType) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  const { unmounted } = useSelector((state: RootState) => state.modalReducer);

  const closeModal = () => {
    if (isDelete) return;
    setTimeout(() => {
      dispatch(closeBtnValue());
    }, 200);
    dispatch(closeBtn());
  };

  const deleteHandler = async () => {
    setIsDelete(true);

    const res = await response();
    if (name.title === 'Order')
      dispatch(refetchOrder({ isTransactionRefetch: true }));
    dispatch(closeBtn());
    dispatch(closeBtnValue());
    responseToast({ res, navigate, url, relative: 'path' });
    setIsDelete(false);
  };

  return (
    <>
      <div className="modal">
        <div
          className={`modal-layout`}
          style={isDelete ? { cursor: 'not-allowed' } : {}}
          onClick={closeModal}
        />
        <div className={`modal-content ${unmounted && 'unmounted'}`}>
          <header className={'modal-content--header'}>
            <div className={'main-header'}>
              <h1>Confirm Delete?</h1>
            </div>
            <div className={'close-btn-layout'}>
              <button
                type="button"
                className={'close-btn'}
                disabled={isDelete}
                onClick={closeModal}
              >
                <IoClose />
              </button>
            </div>
          </header>
          <main className={'modal-content--main'}>
            <h2>
              Are you sure want to <span>Delete</span>?
            </h2>
            <h2>
              {name.title} :{' '}
              <em>
                {name.title === 'Order'
                  ? name.orderName
                  : name.title === 'Product'
                  ? name.productName
                  : name.userName}
              </em>
            </h2>
            <div className="btn-container">
              <button
                className="btn btn-yes"
                disabled={isDelete}
                onClick={deleteHandler}
              >
                Yes
              </button>
              <button
                className="btn btn-no"
                disabled={isDelete}
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// export function ModalBtn() {
//   return (
//     <button
//       onClick={() => {
//         setValue(true);
//         setUnmounted(false);
//       }}
//     >
//       Modal
//     </button>
//   );
// }
