import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setTickets } from '../store/reducers/ticketSlice';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Ticket from './Ticket';
import Stall from './Stall';

export default function Home() {

  //const accessToken = useSelector((state)=> state.user.token);
  const accessToken = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.tickets.list);
  const userData = useSelector((state) => state.user.user);
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [rides, setRides] = useState([]);
  const [activites, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRide, setSelectedRide] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);


  function selectRide(rideId) {
    setSelectedRide(rideId);
    setIsRideModalOpen(true);
  }
  function selectActivity(activityId) {
    setSelectedActivity(activityId);
    setIsActivityModalOpen(true);
  }

  useEffect(() => {
    axios.get(`${backendUrl}/tickets/allTickets`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        dispatch(setTickets(res.data));
        setActiveTickets(res.data.filter(ticket => ticket.status == "Active"));
      });

    axios.get(`${backendUrl}/stalls/allStalls`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        var myRides = [];
        var myActivities = [];

        res.data.forEach(item => {
          if(item.status == 'active'){
            if (item.stallType == "Ride") {
              myRides.push(item);
            }
            else {
              myActivities.push(item);
            }
          }
        });
        setRides(myRides);
        setActivities(myActivities);
      });

    axios.get(`${backendUrl}/tickets/allBookings/${userData._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
        setBookings(res.data);
    });

  }, []);

  return (
    <div className='pt-20 p-10'>
      <div className='mb-4 flex w-full gap-5 justify-center'>
        {
          userData.is_admin ?

            tickets.length > 0 ?
              tickets.map((ticket, index) => <Ticket key={index} ticket={ticket} user={userData} />)
              :
              <h1 className='text-3xl text-center font-semibold'>No Tickets Available!!</h1>
            :
            activeTickets.length > 0 ?
              activeTickets.map((ticket, index) => <Ticket key={index} ticket={ticket} user={userData} />)
              :
              <h1 className='text-3xl text-center font-semibold'>No Tickets Available!!</h1>
        }
      </div>
      <h1 className='text-center text-3xl font-semibold mt-2 underline'>Stalls Available:</h1>
      <h1 className='text-2xl font-semibold'>Rides:</h1>
      <hr />
      <div className='mt-5 flex flex-wrap gap-10'>
        {
          rides && rides.length > 0 ? 
            rides.map((stall, index) => <Stall stall={stall} selectStall={selectRide} userData={userData} />)
          :
            <h1 className='text-xl font-semibold mx-auto'>No Rides!!</h1>
        }
      </div>
      <h1 className='text-2xl font-semibold mt-3'>Activities:</h1>
      <hr />
      <div className='mt-5 flex flex-wrap gap-10'>
        { 
          activites && activites.length > 0 ? 
          activites.map((stall, index) => <Stall stall={stall} selectStall={selectActivity} userData={userData} />)
          :
            <h1 className='text-xl font-semibold mx-auto'>No Activites!!</h1>
        }
      </div>

      {/* Modal */}
      {isRideModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-7 bg-white'>
            <h1 className='font-medium text-xl text-center'>Select Ticket to Buy Ride.</h1>
            <div>
              {bookings.length == 0 && <h1 className='text-xl text-center mt-3'>No Bookings!!</h1>}
              {bookings.filter(item => item.status != 'Cancelled').map((booking, index) => (
                <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3 flex justify-between items-center'>
                  <div>
                    <h1><span className='font-semibold'>Name:</span> {booking.ticket.name}</h1>
                    <h1><span className='font-semibold'>Total Tickets:</span> {booking.totalTickets}</h1>
                    <h1><span className='font-semibold'>Total Price:</span> ${booking.totalPrice}</h1>
                    <h1><span className='font-semibold'>Booking Date:</span> {new Date(booking.bookingDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, })}</h1>
                  </div>
                  {!booking.ride &&
                    <Link
                      to={`/bookings/${booking._id}/buyRide/${selectedRide}`}
                      className='rounded-md bg-[#503C3C] px-4 py-1 float-end mt-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]'
                    >
                      Select
                    </Link>
                  }
                </div>
              ))}
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => setIsRideModalOpen(false)}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isActivityModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-7 bg-white'>
            <h1 className='font-medium text-xl text-center'>Select Ticket to Buy Activity.</h1>
            <div>
              {bookings.length == 0 && <h1 className='text-xl text-center mt-3'>No Bookings!!</h1>}
              {bookings.filter(item => item.status != 'Cancelled').map((booking, index) => (
                <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3 flex justify-between items-center'>
                  <div>
                    <h1><span className='font-semibold'>Name:</span> {booking.ticket.name}</h1>
                    <h1><span className='font-semibold'>Total Tickets:</span> {booking.totalTickets}</h1>
                    <h1><span className='font-semibold'>Total Booking Price:</span> ${booking.totalBookingPrice}</h1>
                    <h1><span className='font-semibold'>Booking Date:</span> {new Date(booking.bookingDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, })}</h1>
                  </div>
                  {!booking.activity &&
                    <Link
                      to={`/bookings/${booking._id}/buyActivity/${selectedActivity}`}
                      className='rounded-md bg-[#503C3C] px-4 py-1 float-end mt-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]'
                    >
                      Select
                    </Link>
                  }
                  {booking.activity && !booking.activity.find(item => item.activity == selectedActivity) &&
                    <Link
                      to={`/bookings/${booking._id}/buyActivity/${selectedActivity}`}
                      className='rounded-md bg-[#503C3C] px-4 py-1 float-end mt-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]'
                    >
                      Select
                    </Link>
                  }
                </div>
              ))}
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => setIsActivityModalOpen(false)}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
