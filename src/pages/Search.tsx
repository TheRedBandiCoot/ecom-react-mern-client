import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '../components/Loader';
import ProductCard from '../components/ProductCard';
import {
  useCategoriesQuery,
  useSearchProductsQuery
} from '../redux/api/productAPI';
import { addToCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { CartItem, CustomError } from '../types/types';

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error
  } = useCategoriesQuery('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: searchedData,
    isLoading: productLoading,
    isError: productIsError,
    error: productError
  } = useSearchProductsQuery({
    search,
    sort,
    price: maxPrice,
    category,
    page
  });

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

  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  // console.log(searchedData);

  if (isError) toast.error((error as CustomError).data.message);
  if (productIsError) toast.error((productError as CustomError).data.message);
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>

        <div>
          <h1>Sort</h1>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h1>Max Price : {maxPrice || ''}</h1>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h1>Category</h1>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map(category => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map(i => (
              <ProductCard
                handler={addToCardHandler}
                productID={i._id}
                key={i._id}
                photo={i.photo}
                name={i.name}
                price={i.price}
                stock={i.stock}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage(prev => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
