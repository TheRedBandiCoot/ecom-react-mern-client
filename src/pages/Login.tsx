import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { GoogleAuthProvider, deleteUser, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { getUser, useLoginMutation } from '../redux/api/userAPI';
import { userExist, userNotExist } from '../redux/reducer/userReducer';
import { MessageResponse } from '../types/api-types';

const Login = ({}) => {
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        _id: user.uid,
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        dob: date,
        // @ts-ignore
        gender,
        role: 'user'
      });

      if ('data' in res) {
        toast.success(res.data.message);
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user!));
      } else {
        deleteUser(user);
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
      // console.log(user);
    } catch (error) {
      toast.error('Sign in failed');
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date Of Birth</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
