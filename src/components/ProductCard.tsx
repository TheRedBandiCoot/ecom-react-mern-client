import { FaPlus } from 'react-icons/fa';
import { INRCurrency } from '../utils/INRCurrency';
import { server } from '../redux/store';
import { CartItem } from '../types/types';

interface ProductCardProps {
  productID: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
}

const ProductCard = ({
  handler,
  name,
  photo,
  price,
  productID,
  stock
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>{INRCurrency.format(price)}</span>
      <div>
        <button
          onClick={() =>
            handler({ name, productID, photo, price, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
