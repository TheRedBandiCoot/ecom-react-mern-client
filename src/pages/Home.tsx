import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Skeleton } from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useLatestProductQuery } from '../redux/api/productAPI';
import { addToCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { CartItem } from '../types/types';

const Home = ({}) => {
  const { data, isError, isLoading } = useLatestProductQuery('');
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const addToCardHandler = (cartItem: CartItem) => {
    const isProductInCart = cartItems.some(
      item => item.productID === cartItem.productID
    );
    if (isProductInCart) {
      toast.error('Product is already in the cart');
    } else {
      if (cartItem.stock < 1) return toast.error('Out OF Stock');
      dispatch(addToCart(cartItem));
      toast.success('Added To Cart');
    }
  };

  if (isError) toast.error('Cannot Fetch the products');

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <NavLink to="/search" className="findmore">
          More
        </NavLink>
      </h1>

      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map(product => (
            <ProductCard
              key={product._id}
              handler={addToCardHandler}
              photo={product.photo}
              productID={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
