import { signOut } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt
  // FaUser
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { auth } from '../firebase';
import { RootState } from '../redux/store';
import { User } from '../types/types';

// interface UserTypes {
//   _id: string;
//   role?: 'user' | 'admin';
// }
// const user: UserTypes = { _id: ``, role: undefined }; //${crypto.randomUUID()}
interface HeaderProps {
  user: User | null;
}

const femaleAvatar =
  'https://i.ibb.co/hW68HYg/3d-illustration-human-avatar-profile-23-2150671128.jpg';
const maleAvatar =
  'https://i.ibb.co/tpdqnf8/3d-illustration-human-avatar-profile-23-2150671142.jpg';

const Header = ({ user }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  async function logoutHandler() {
    try {
      await signOut(auth);
      toast.success('Sign Out successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Sign Out failed');
    }
  }

  return (
    <>
      <nav className="header">
        <NavLink
          className={({ isActive }) =>
            isActive ? 'header-home active' : 'header-home'
          }
          onClick={() => setIsOpen(false)}
          to="/"
        >
          HOME
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'search active' : '')}
          onClick={() => setIsOpen(false)}
          to="/search"
        >
          <FaSearch />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? 'user-cart active' : `user-cart`
          }
          onClick={() => setIsOpen(false)}
          to="/cart"
        >
          {cartItems.length > 0 && (
            <div className="user-cart-after">
              {cartItems.length > 9 ? '9+' : cartItems.length}
            </div>
          )}
          <FaShoppingBag />
        </NavLink>

        {user?._id ? (
          <>
            <button onClick={() => setIsOpen(!isOpen)}>
              <img
                className="user-profile-img"
                referrerPolicy="no-referrer"
                src={
                  user.photo == null || user.photo.length < 1
                    ? user.gender === 'male'
                      ? maleAvatar
                      : femaleAvatar
                    : user.photo
                }
                alt={user.name}
              />
              {/* <FaUser /> */}
            </button>
            <dialog open={isOpen}>
              <div>
                {user.role === 'admin' && (
                  <NavLink
                    onClick={() => setIsOpen(false)}
                    to="/admin/dashboard"
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink onClick={() => setIsOpen(false)} to="/orders">
                  Orders
                </NavLink>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <NavLink to="/login">
            <FaSignInAlt />
          </NavLink>
        )}
      </nav>
    </>
  );
};

export default Header;
