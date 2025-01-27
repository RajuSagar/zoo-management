import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Welcome from './Components/Welcome';
import Home from './Components/Home';
import AddTicket from './Components/AddTicket';
import Login from './Components/Login';
import Register from './Components/Register';
import { useEffect, useState } from 'react';
import { backendUrl } from './constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setToken, setUser } from './store/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux'
import Main from './Components/Main';
import NotFound from './Components/NotFound';
import BuyTicket from './Components/BuyTicket';
import AddStall from './Components/AddStall';
import BuyRide from './Components/BuyRide';
import BuyActivity from './Components/BuyActivity';
import UserBookings from './Components/UserBookings';
import AllBookings from './Components/AllBookings';
import AdminLogin from './Components/AdminLogin';
import CustomerLogin from './Components/CustomerLogin';
import CustomerRegistration from './Components/CustomerRegistration';
import EditStall from './Components/EditStall';



function App() {
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");
  const userData = useSelector((state) => state.user.user);
  const [isUserFetched, setIsUserFetched] = useState(false);

  async function setUserDetails() {
    if (accessToken) {
      await axios.get(`${backendUrl}/users/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          const data = res.data;
          dispatch(setUser(data.data));
          dispatch(setToken(accessToken));
        })
        .catch((err) => {
          dispatch(setUser(null));
          dispatch(setToken(null));
          Cookies.remove('accessToken');
        });
    }
    else {
      dispatch(setUser(null));
      dispatch(setToken(null));
    }
  }

  useEffect(() => {
    setUserDetails().then(() => { setIsUserFetched(true) });
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Main />,
      children: [
        {
          path: '',
          element: !userData ? <Welcome /> : <Navigate to={'/home'} />,
        },
        {
          path: '/home',
          element: userData ? <Home /> : <Navigate to={'/'} />,
        },
        {
          path: '/addTicket',
          element: userData?.is_admin ? <AddTicket /> : <Navigate to={'/home'} />,
        },
        {
          path: '/addStall',
          element: userData?.is_admin ? <AddStall /> : <Navigate to={'/home'} />,
        },
        {
          path: '/editStall/:stallId',
          element: userData?.is_admin ? <EditStall /> : <Navigate to={'/home'} />,
        },
        {
          path: '/AdminLogin',
          element: !userData ? <AdminLogin /> : <Navigate to={'/home'} />,
        },
        {
          path: '/CustomerLogin',
          element: !userData ? <CustomerLogin /> : <Navigate to={'/home'} />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/customerRegister',
          element: !userData ? <CustomerRegistration /> : <Navigate to={'/home'} />,
        },
        {
          path: '/buyTicket/:ticketId',
          element: userData ? <BuyTicket /> : <Navigate to={'/'} />,
        },
        {
          path: '/allBookings',
          element: userData ? <AllBookings /> : <Navigate to={'/'} />,
        },
        {
          path: '/bookings/:bookingId/buyRide/:rideId',
          element: userData ? <BuyRide /> : <Navigate to={'/'} />
        },
        {
          path: '/bookings/:bookingId/buyActivity/:activityId',
          element: userData ? <BuyActivity /> : <Navigate to={'/'} />
        },
        {
          path: '/bookings/:userId',
          element: userData ? <UserBookings /> : <Navigate to={'/'} />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);

  return (
    <div className="App">
      {isUserFetched && <RouterProvider router={router} />}
    </div>
  );
}

export default App;
