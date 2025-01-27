import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CancelledBooking({ payment, userData }) {

    const bookingTime = new Date(payment.bookingDate);
    const cancellationTime = new Date(bookingTime.getTime() + 60 * 60 * 1000);
    const accessToken = useSelector((state) => state.user.token);
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [totalRefundAmount, setTotalRefundAmount] = useState(null);
    const [entireBookingCancellation, setEntireBookingCancellation] = useState(null);
    const [stallCancellations, setStallCancellations] = useState(null);

    useEffect(()=>{
        axios.get(`${backendUrl}/tickets/bookings/${payment.bookingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((res)=>{
            console.log(res.data);
            setBooking(res.data);
        })

        var totalAmount = 0;
        var stalls = [];
        payment.paymentDetails.forEach(element => {
            totalAmount += element.amount;
            if(element.stall != null){
                stalls.push(element);
            }
            else{
                setEntireBookingCancellation(element);
            }
        });
        setStallCancellations(stalls);
        setTotalRefundAmount(totalAmount);
    },[])

    return (
        <div className='w-[80%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] p-4 mb-2'>
            <h1 className='font-medium text-xl text-center'>Booking Details.</h1>
            <hr />
            {
                booking &&

                <div className='flex flex-wrap justify-center mt-2'>
                    {userData.is_admin && <h1 className='mx-4'><span className='font-semibold'>Customer Name:</span> {booking.customer.name}</h1>}
                    <h1 className='mx-4'><span className='font-semibold'>Ticket Name:</span> {booking.ticket.name} </h1>
                    {/* <h1 className='mx-4'><span className='font-semibold'>Total Tickets:</span> {payment.totalTickets}</h1> */}
                    {/* <h1 className='mx-4'><span className='font-semibold'>Total Ticket Price:</span> ${payment.totalPrice}</h1> */}
                    <h1 className='mx-4'><span className='font-semibold'>Booking Date:</span> {new Date(booking.bookingDate).toLocaleString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}</h1>
                    {/* <h1 className='mx-4'><span className='font-semibold'>Total Booking Price:</span> ${payment.totalBookingPrice}</h1> */}
                    <h1 className='mx-4'><span className='font-semibold'>Date Booked For:</span> {new Date(booking.schedule.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ({booking.schedule.slot.slot})</h1>
                    <h1 className='mx-4'><span className='font-semibold'>Total refund Price:</span> ${totalRefundAmount} </h1>
                </div>
            }
            {
                entireBookingCancellation && booking &&

                <div>
                    <h1 className='mt-2 text-center font-semibold'>Person Details:</h1>
                    <hr />
                        <div className='flex flex-wrap justify-center mt-2'>
                        {/* {userData.is_admin && <h1 className='mx-4'><span className='font-semibold'>Customer Name:</span> {payment.customer.name}</h1>} */}
                        <h1 className='mx-4'><span className='font-semibold'>Total Tickets:</span> {booking.totalTickets} </h1>
                        <h1 className='mx-4'><span className='font-semibold'>Booking refund Price:</span> ${booking.totalPrice} </h1>
                        {/* <h1 className='mx-4'><span className='font-semibold'>Total Tickets:</span> {payment.totalTickets}</h1> */}
                        {/* <h1 className='mx-4'><span className='font-semibold'>Total Ticket Price:</span> ${payment.totalPrice}</h1> */}
                        {/* <h1 className='mx-4'><span className='font-semibold'>Total Booking Price:</span> ${payment.totalBookingPrice}</h1> */}
                    </div>
                </div>

                    /* {
                        payment.adultTickets.length > 0 &&
                        <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                            <h1 className='text-center w-full font-semibold underline'>Adult Tickets</h1>
                            <div>
                                {payment.adultTickets.map((adult, ai) => (
                                    <div key={ai} className='flex gap-10'>
                                        <h1><span className='font-semibold'>Name:</span> {adult.name}</h1>
                                        <h1><span className='font-semibold'>Age:</span> {adult.age}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {
                        payment.childrenTickets.length > 0 &&
                        <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                            <h1 className='text-center w-full font-semibold underline'>Children Tickets</h1>
                            <div>
                                {payment.childrenTickets.map((children, ai) => (
                                    <div key={ai} className='flex gap-10'>
                                        <h1><span className='font-semibold'>Name:</span> {children.name}</h1>
                                        <h1><span className='font-semibold'>Age:</span> {children.age}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {
                        payment.seniorTickets.length > 0 &&
                        <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                            <h1 className='text-center w-full font-semibold underline'>Senior Tickets</h1>
                            <div>
                                {payment.seniorTickets.map((senior, ai) => (
                                    <div key={ai} className='flex gap-10'>
                                        <h1><span className='font-semibold'>Name:</span> {senior.name}</h1>
                                        <h1><span className='font-semibold'>Age:</span> {senior.age}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {
                        payment.handicappedTickets.length > 0 &&
                        <div className='mt-3 ring-1 ring-[#503C3C] rounded-md flex flex-col p-1 justify-between items-center'>
                            <h1 className='text-center w-full font-semibold underline'>Handicapped Tickets</h1>
                            <div>
                                {payment.handicappedTickets.map((handicapped, ai) => (
                                    <div key={ai} className='flex gap-10'>
                                        <h1><span className='font-semibold'>Name:</span> {handicapped.name}</h1>
                                        <h1><span className='font-semibold'>Age:</span> {handicapped.age}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    } */
            }
            {
                stallCancellations && stallCancellations.length > 0 &&
                <div>
                    <h1 className='mt-2 text-center font-semibold'>Stalls:</h1>
                    <hr />
                    <div className='flex flex-col'>
                        {stallCancellations.map((stall, ii) => (
                            <div key={ii} className='mt-3 ring-1 ring-[#503C3C] rounded-md flex p-3 justify-between items-center'>
                                <h1><span className='font-semibold'>Name:</span> {stall.stall.name}</h1>
                                <h1><span className='font-semibold'>Refund Price:</span> ${stall.amount}</h1>
                                <h1><span className='font-semibold'>Total Tickets:</span> {stall.totalTickets}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
