import { ReactElement, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLogin, isLogout } from '../redux/reducer/userReducer';
import { RootState } from '../redux/store';

interface ProtectedRouteType {
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  children?: ReactElement;
  redirect?: string;
  isCart?: boolean;
}

function ProtectedRoute({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect = '/',
  isCart
}: ProtectedRouteType) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { justLoggedIn } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    if (location.pathname === '/login' && isAuthenticated) {
      dispatch(isLogin());
    }
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !justLoggedIn && isCart) {
      setTimeout(() => {
        toast.success('Already Logged In');
        dispatch(isLogout());
      }, 1000);
    }
  }, [isAuthenticated, justLoggedIn, isCart]);

  if (!isAuthenticated || isCart) return <Navigate to={redirect} />;

  if (adminOnly && !admin) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
