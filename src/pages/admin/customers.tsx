import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash, FaUserLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '../../components/Loader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Table as TanstackTable } from '../../components/admin/Table';
import {
  useAllUsersQuery,
  useDeleteUsersMutation
} from '../../redux/api/userAPI';
import { RootState } from '../../redux/store';
import { CustomError } from '../../types/types';
import { Modal as modal } from '../../components/Modal';
import { openBtn } from '../../redux/reducer/modalReducer';

const femaleAvatar =
  'https://i.ibb.co/hW68HYg/3d-illustration-human-avatar-profile-23-2150671128.jpg';
const maleAvatar =
  'https://i.ibb.co/tpdqnf8/3d-illustration-human-avatar-profile-23-2150671142.jpg';

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  createdAt?: Date | string;
  action: ReactElement;
}

const columnHelper = createColumnHelper<DataType>();

const columns = [
  columnHelper.accessor('avatar', {
    cell: info => info.getValue(),
    header: () => <span>Avatar</span>
  }),
  columnHelper.accessor('name', {
    cell: info => info?.getValue(),
    header: () => <span>Name</span>,
    sortingFn: 'alphanumeric'
  }),
  //@  you can use different approach here
  columnHelper.accessor('gender', {
    cell: info => info.getValue(),
    header: () => <span>Gender</span>
  }),
  columnHelper.accessor(row => row.email, {
    id: 'email',
    cell: info => info.getValue(),
    header: () => <span>Email</span>
  }),
  columnHelper.accessor('role', {
    cell: info => info?.getValue(),
    header: () => <span>Role</span>
  }),
  columnHelper.accessor('createdAt', {
    cell: info => info?.getValue(),
    header: () => <span>CreatedAt</span>,
    sortingFn: 'datetime'
  }),
  columnHelper.accessor('action', {
    cell: info => <span className="action">{info.getValue()}</span>,
    header: () => <span>Action</span>
  })
];
const Customers = () => {
  const [data, setData] = useState<DataType[]>([]);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { value, id, name } = useSelector(
    (state: RootState) => state.modalReducer
  );
  const dispatch = useDispatch();

  const {
    data: usersData,
    isLoading,
    isError,
    error
  } = useAllUsersQuery(user?._id!);
  const [deleteUser] = useDeleteUsersMutation();

  const deleteUserHandler = (id: string, name: string) => {
    dispatch(openBtn({ id, name }));
  };

  const res = async () => {
    const res = await deleteUser({
      userId: id!,
      AdminUserId: user?._id!
    });
    return res;
  };

  useEffect(() => {
    if (usersData) {
      setData(
        usersData.users.map(i => {
          const date = new Date(i.createdAt as Date);
          const createdAt = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;

          return {
            name: i.name,
            email: i.email,
            avatar: (
              <img
                src={
                  i.photo === null || i.photo.length < 1
                    ? i.gender === 'male'
                      ? maleAvatar
                      : femaleAvatar
                    : i.photo
                }
                alt={i.name}
              />
            ),
            gender: i.gender,
            role: i.role,
            createdAt,
            action:
              i._id === `${import.meta.env.VITE_USER_ADMIN_ID}` ? (
                <FaUserLock
                  style={{
                    fontSize: '1.4rem',
                    color: '#61ab75',
                    opacity: '0.8'
                  }}
                />
              ) : (
                <button onClick={() => deleteUserHandler(i._id, i.name)}>
                  <FaTrash />
                </button>
              )
          };
        })
      );
    }
  }, [usersData]);

  if (isError) toast.error((error as CustomError).data.message);

  const pageSize = 6;
  const Table = TanstackTable<DataType, ColumnDef<DataType, any>[]>(
    data,
    columns
  )('Customers', pageSize, data.length > pageSize);

  const Modal = modal({
    name: { title: 'User', userName: name! },
    res,
    url: '.'
  });

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {value && <>{Modal}</>}
        {isLoading ? (
          <Skeleton length={10} marginTop="2rem" width="98%" />
        ) : (
          Table
        )}
      </main>
    </div>
  );
};

export default Customers;
