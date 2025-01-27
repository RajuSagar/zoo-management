import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { backendUrl } from '../constants';
import axios from 'axios';
import Booking from './Booking';
import CancelledBooking from './CancelledBooking';

export default function AllBookings() {
    
    const [bookings, setBookings] = useState();
    const [cancelledBookings, setCancelledBookings] = useState();
    const userData = useSelector((state) => state.user.user);
    const accessToken = useSelector((state) => state.user.token);


    useEffect(()=>{
        axios.get(`${backendUrl}/tickets/allBookings`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((res) => {
            var myBookings = [];

            res.data.forEach(item => {
            if (item.status == "Cancelled") {
                
            }
            else {
                myBookings.push(item);
            }
            });
            setBookings(myBookings);
        });

        axios.get(`${backendUrl}/payments/cancelledPayments`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((res) => {
            const payments = res.data;

            // Group payments by booking._id
            const groupedPayments = payments.reduce((acc, payment) => {
                const bookingId = payment.booking._id;
                if (!acc[bookingId]) {
                    acc[bookingId] = { bookingId, paymentDetails: [] };
                }
                acc[bookingId].paymentDetails.push(payment);
                return acc;
            }, {});

            // Convert groupedPayments object to an array
            const sortedPayments = Object.values(groupedPayments);

            setCancelledBookings(sortedPayments)
        })
    },[]);

  return (
    <div className='h-screen pt-16'>
        <div className='flex'>
            <div className='w-[50%]'>
                <h1 className='text-2xl font-semibold text-center'>All Bookings</h1>
                {bookings && bookings.length == 0 && <h1 className='text-xl text-center mt-3'>No Bookings!!</h1>}
                <div className='flex flex-col gap-8 justify-center items-center mt-5'>
                    {bookings && bookings.map((booking, index) => (
                        <Booking booking={booking} key={index} userData={userData}/>
                    ))}
                </div>
            </div>
            <div className='w-[50%]'>
                <h1 className='text-2xl font-semibold text-center'>All Cancellations</h1>
                {cancelledBookings && cancelledBookings.length == 0 && <h1 className='text-xl text-center mt-3'>No Cancellations!!</h1>}
                <div className='flex flex-col gap-8 justify-center items-center mt-5'>
                    {cancelledBookings && cancelledBookings.map((payment, index) => (
                        <CancelledBooking payment={payment} key={index} userData={userData}/>
                    ))}
                </div>
            </div>
        </div>
        
    </div>
  )
}
