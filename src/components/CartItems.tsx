import { FaTrash } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { INRCurrency } from '../utils/INRCurrency';
import { server } from '../redux/store';
import { CartItem } from '../types/types';

interface CartItemsProps {
  cartItem: CartItem;
  incrementQuantityHandler: (cartItem: CartItem) => void;
  decrementQuantityHandler: (cartItem: CartItem) => void;
  removeItemHandler: (productID: string) => void;
}
function CartItems({
  cartItem,
  decrementQuantityHandler,
  incrementQuantityHandler,
  removeItemHandler
}: CartItemsProps) {
  const { name, photo, price, productID, quantity } = cartItem;
  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <NavLink to={`product/${productID}`}>{name}</NavLink>
        <span>{INRCurrency.format(price)}</span>
      </article>

      <div>
        <button onClick={() => decrementQuantityHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementQuantityHandler(cartItem)}>+</button>
      </div>
      <button onClick={() => removeItemHandler(productID)}>
        <FaTrash />
      </button>
    </div>
  );
}

export default CartItems;
