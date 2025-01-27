import { useSelector, useDispatch } from 'react-redux'
import { backendUrl } from '../constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, setToken } from '../store/reducers/authSlice';

export default function Navbar() {
  const accessToken = useSelector((state) => state.user.token);
  const userData = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleSignOut() {
    axios.post(
      `${backendUrl}/users/logout`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    ).then(() => {
      navigate('/');
      dispatch(setUser(null));
      dispatch(setToken(null));
    })
  }

  return (
    <div as="nav" className="fixed w-full bg-[#3E3232] z-50">
      <div className="mx-8 px-2">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center justify-center">
            <h1 className='text-[#F8F4EC] text-2xl'>Zoo Ticket Management</h1>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link to={'/home'} className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'>Home</Link>
                {userData && !userData.is_admin &&
                  <Link
                    to={`/bookings/${userData._id}`}
                    className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                  >
                    My Bookings
                  </Link>
                }
                {userData && userData.is_admin &&
                  <Link
                    to={'/addTicket'}
                    className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                  >
                    Add Ticket
                  </Link>
                }
                {userData && userData.is_admin &&
                  <Link
                    to={'/addStall'}
                    className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                  >
                    Add Stall
                  </Link>
                }
                {userData && userData.is_admin &&
                  <Link
                    to={'/allBookings'}
                    className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                  >
                    All Bookings
                  </Link>
                }
                {userData && userData.is_admin &&
                  <Link
                    to={'/register'}
                    className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                  >
                    Add Admin
                  </Link>
                }

              </div>
            </div>
          </div>
          <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {
              userData &&
              <button
                type='button'
                onClick={handleSignOut}
                className='text-gray-300 bg-[#503C3C] hover:bg-[#7E6363] hover:text-white rounded-md px-3 py-2 text-sm font-medium'
              >
                Log Out
              </button>

            }
          </div>
        </div>
      </div>
    </div>
  )
}
