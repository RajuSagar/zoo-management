import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Booking({ booking, userData }) {

    const bookingTime = new Date(booking.bookingDate);
    const cancellationTime = new Date(bookingTime.getTime() + 60 * 60 * 1000);
    const [remainingTime, setRemainingTime] = useState(cancellationTime - new Date());
    const accessToken = useSelector((state) => state.user.token);
    const navigate = useNavigate();

    const formattedBookingDate = new Date(booking.bookingDate).toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });


    function formatRemainingTime(remainingTime) {
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    function callDeleteBookingApi() {
        axios.delete(`${backendUrl}/tickets/bookings/${booking._id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(() => {
            window.location.reload();
        })
    }

    function deleteBooking() {
        if (booking.ride || booking.activity) {
            if (window.confirm("Your Rides and Activities will also be deleted. Do you Confirm?")) {
                callDeleteBookingApi();
            }
        } else {
            callDeleteBookingApi();
        }
    }

    function cancelRide(rideId){
        if (window.confirm("Are you sure you want to delete Ride?")) {
            axios.delete(`${backendUrl}/tickets/deleteRideByBooking/${booking._id}/${rideId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                window.location.reload();
                window.alert("Your money will be refunded in 2 business days!!")
            })
        }
    }

    function cancelActivity(activityId){
        if (window.confirm("Are you sure you want to delete Ride?")) {
            axios.delete(`${backendUrl}/tickets/deleteActivityByBooking/${booking._id}/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                window.location.reload();
                window.alert("Your money will be refunded in 2 business days!!")
            })
        }
    }

    useEffect(() => {
        if (!userData.is_admin) {
            const timer = setInterval(() => {
                const currentTime = new Date();
                const newRemainingTime = cancellationTime - currentTime;
                setRemainingTime(newRemainingTime);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [userData.is_admin, cancellationTime]);


    return (
        <div className='w-[80%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] p-4 mb-2'>
            <h1 className='font-medium text-xl text-center'>Booking Details.</h1>
            <hr />
            <div>
                <div className='flex flex-wrap justify-center mt-2'>
                    {userData.is_admin && <h1 className='mx-4'><span className='font-semibold'>Customer Name:</span> {booking.customer.name}</h1>}
                    <h1 className='mx-4'><span className='font-semibold'>Ticket Name:</span> {booking.ticket.name}</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Total Tickets:</span> {booking.totalTickets}</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Total Ticket Price:</span> ${booking.totalPrice}</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Booking Date:</span> {formattedBookingDate}</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Total Booking Price:</span> ${booking.totalBookingPrice}</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Date Booked For:</span> {new Date(booking.schedule.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ({booking.schedule.slot.slot})</h1>
                </div>
                {!userData.is_admin && remainingTime > 0 &&
                    <div className='flex items-center justify-between w-full ring-1 ring-yellow-600 rounded-md p-2 mt-2'>
                        <div className='flex justify-center items-center gap-2'>
                            <h1 className='text-md font-semibold'>Note: </h1>
                            <h1>Your can cancel Booking in: {formatRemainingTime(remainingTime)}</h1>
                        </div>
                        <button
                            onClick={deleteBooking}
                            className='rounded-md float-end bg-red-600 text-white shadow-sm h-8 px-2 hover:bg-red-500'
                        >
                            Cancel
                        </button>
                    </div>
                }
                {
                    booking.adultTickets.length > 0 &&
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                        <h1 className='text-center w-full font-semibold underline'>Adult Tickets</h1>
                        <div>
                            {booking.adultTickets.map((adult, ai) => (
                                <div key={ai} className='flex gap-10'>
                                    <h1><span className='font-semibold'>Name:</span> {adult.name}</h1>
                                    <h1><span className='font-semibold'>Age:</span> {adult.age}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {
                    booking.childrenTickets.length > 0 &&
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                        <h1 className='text-center w-full font-semibold underline'>Children Tickets</h1>
                        <div>
                            {booking.childrenTickets.map((children, ai) => (
                                <div key={ai} className='flex gap-10'>
                                    <h1><span className='font-semibold'>Name:</span> {children.name}</h1>
                                    <h1><span className='font-semibold'>Age:</span> {children.age}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {
                    booking.seniorTickets.length > 0 &&
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                        <h1 className='text-center w-full font-semibold underline'>Senior Tickets</h1>
                        <div>
                            {booking.seniorTickets.map((senior, ai) => (
                                <div key={ai} className='flex gap-10'>
                                    <h1><span className='font-semibold'>Name:</span> {senior.name}</h1>
                                    <h1><span className='font-semibold'>Age:</span> {senior.age}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {
                    booking.handicappedTickets.length > 0 &&
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                        <h1 className='text-center w-full font-semibold underline'>Handicapped Tickets</h1>
                        <div>
                            {booking.handicappedTickets.map((handicapped, ai) => (
                                <div key={ai} className='flex gap-10'>
                                    <h1><span className='font-semibold'>Name:</span> {handicapped.name}</h1>
                                    <h1><span className='font-semibold'>Age:</span> {handicapped.age}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            {
                booking.ride &&
                
                <div>
                    <h1 className='mt-2 text-center font-semibold'>Ride:</h1>
                    <hr />
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex p-3 justify-between items-center'>
                        <h1><span className='font-semibold'>Name:</span> {booking.ride.ride.name}</h1>
                        <h1><span className='font-semibold'>Total Price:</span> ${booking.ride.totalPrice}</h1>
                        <h1><span className='font-semibold'>Total Tickets:</span> {booking.ride.totalTickets}</h1>
                        { !userData.is_admin && 
                        
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" onClick={()=> cancelRide(booking.ride.ride._id)} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 hover:cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        }

                    </div>
                </div>
            }
            {
                booking.activity && booking.activity.length > 0 &&

                <div>
                    <h1 className='mt-2 text-center font-semibold'>Activities:</h1>
                    <hr />
                    <div className='flex flex-col'>
                        {booking.activity.map((activity, ii) => (
                            <div key={ii} className='mt-3 ring-1 ring-[#503C3C] rounded-md flex p-3 justify-between items-center'>
                                <h1><span className='font-semibold'>Name:</span> {activity.activity.name}</h1>
                                <h1><span className='font-semibold'>Total Price:</span> ${activity.totalPrice}</h1>
                                <h1><span className='font-semibold'>Total Tickets:</span> {activity.totalTickets}</h1>
                                { !userData.is_admin && 
                        
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" onClick={()=> cancelActivity(activity._id)} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 hover:cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
