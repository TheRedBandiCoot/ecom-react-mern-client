import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '../../../components/Loader';
import { Modal } from '../../../components/Modal';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import {
  useDeleteProductMutation,
  useProductDetailQuery,
  useUpdateProductMutation
} from '../../../redux/api/productAPI';
import { openBtn } from '../../../redux/reducer/modalReducer';
import { RootState } from '../../../redux/store';
import { CustomError } from '../../../types/types';
import { responseToast } from '../../../utils/features';

const Productmanagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { value } = useSelector((state: RootState) => state.modalReducer);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const {
    data,
    isLoading: productDetailIsLoading,
    isError: productDetailIsError,
    error
  } = useProductDetailQuery(id!);

  const { price, stock, name, category, photo } = data?.product || {
    price: 0,
    stock: 0,
    name: '',
    category: '',
    photo: ''
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (nameUpdate) formData.set('name', nameUpdate);
    if (priceUpdate) formData.set('price', priceUpdate.toString());
    if (stockUpdate != undefined) formData.set('stock', stockUpdate.toString());
    if (photoFile) formData.set('photo', photoFile);
    if (categoryUpdate) formData.set('category', categoryUpdate);
    const res = await updateProduct({
      userID: user?._id!,
      productID: data?.product._id!,
      formData
    });
    responseToast({ res, navigate, url: '..', relative: 'path' });
  };

  const deleteModal = () => {
    dispatch(openBtn());
  };

  const res = async () => {
    const res = await deleteProduct({
      userID: user?._id!,
      productID: data?.product._id!
    });
    return res;
  };
  useEffect(() => {
    if (data) {
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setNameUpdate(data.product.name);
      setCategoryUpdate(data.product.category);
      setPhotoUpdate(data.product.photo);
    }
  }, [data]);

  useEffect(() => {
    value
      ? (document.body.style.overflowY = 'hidden')
      : (document.body.style.overflowY = 'scroll');
  }, [value]);

  if (productDetailIsError) {
    toast.error(`${(error as CustomError).data.message}`);
    return <Navigate to={`/404`} />;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {value && (
          <Modal
            name={{ title: 'Product', productName: data?.product.name! }}
            res={res}
          />
        )}
        {productDetailIsLoading ? (
          <Skeleton width="100%" height="67vh" length={1}>
            <Skeleton bgColor="#474747" length={11} />
          </Skeleton>
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={photo} alt={name} />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteModal}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={e => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={e => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={e => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={e => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
