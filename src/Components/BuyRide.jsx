import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function BuyRide() {

    const { bookingId, rideId } = useParams();
    const [booking, setBooking] = useState();
    const [myRide, setRide] = useState();
    const [rideTotalPrice, setRideTotalPrice] = useState(0);
    const [rideTotalTickets, setRideTotalTickets] = useState(0);
    const [availableTickets, setAvailableTickets] = useState(null);
    const [canBuyTickets, setCanBuyTickets] = useState(true);
    const accessToken = useSelector((state) => state.user.token);
    const userData = useSelector((state) => state.user.user);
    const [isPurchaseButtonDisabled, setIsPurchaseButtonDisabled] = useState(true);
    const [cardNumber, setCardNumber] = useState(null);
    const [holderName, setHolderName] = useState(null);
    const [cvv, setCvv] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${backendUrl}/tickets/bookings/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setBooking(res.data);
                setAvailableTickets(res.data.totalTickets);
            });

        axios.get(`${backendUrl}/stalls/${rideId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setRide(res.data);
            });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            axios.get(`${backendUrl}/stalls/getTicketsCount/${rideId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res) => {
                    setAvailableTickets(res.data);
                })
        }, 1000);

        return () => clearInterval(timer);
    }, [myRide]);

    useEffect(() => {
        if (availableTickets) {
            if (rideTotalTickets >= availableTickets) {
                setCanBuyTickets(false);
            }
            else {
                setCanBuyTickets(true);
            }
        }
    }, [rideTotalTickets]);

    useEffect(() => {
        const isFormValid = cardNumber && holderName && cvv
        setIsPurchaseButtonDisabled(!isFormValid);
    }, [cardNumber, holderName, cvv]);

    function buyRide() {
        if (rideTotalTickets > availableTickets) {
            window.alert("Sorry We Don't have any tickets");
            window.location.reload();
        }
        else {
            setIsPaymentModalOpen(true);
        }
    }

    function confirmPurchase() {
        axios.put(`${backendUrl}/tickets/addRide/${bookingId}`,
        {
            totalBookingPrice: booking.totalBookingPrice + rideTotalPrice,
            ride: {
                ride: myRide._id,
                totalPrice: rideTotalPrice,
                totalTickets: rideTotalTickets
            }
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                axios.post(`${backendUrl}/payments/addPayment`,
                    {
                        booking: booking._id,
                        customer: userData._id,
                        stall: myRide._id,
                        amount: rideTotalPrice,
                        cardNumber,
                        holderName,
                        cvv,
                        totalTickets: rideTotalTickets
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    }
                )
                navigate(`/bookings/${userData._id}`);
            });
    }

    useEffect(() => {
        if (myRide) {
            setRideTotalPrice(myRide.price * rideTotalTickets);
        }

    }, [rideTotalTickets])

    return (
        <div className='flex justify-center items-center h-full pt-16'>
            <div className='w-[35%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] mt-11 my-5 p-9'>
                <h1 className='font-medium text-xl text-center mb-2'>Booking Details</h1>
                <hr />
                {booking &&
                    <div className='my-2'>
                        <h1><span className='font-semibold'>Ticket Name:</span> {booking.ticket.name}</h1>
                        <h1><span className='font-semibold'>Total Tickets:</span> {booking.totalTickets}</h1>
                        <h1><span className='font-semibold'>Total Price:</span> ${booking.totalPrice}</h1>
                        <h1><span className='font-semibold'>Date Booked For:</span> {new Date(booking.schedule.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ({booking.schedule.slot.slot})</h1>
                    </div>
                }
                <hr />
                <h1 className='text-lg font-semibold'>Buy Ride:</h1>
                {myRide &&
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
                        <h4><span className='font-semibold'>Ride Name:</span> {myRide.name}</h4>
                        <h4><span className='font-semibold'>Price:</span> ${myRide.price}</h4>
                        <h1><span className='font-semibold'>Tickets Available:</span> {availableTickets}</h1>
                        <h1><span className='font-semibold'>Ride Total Tickets:</span> {rideTotalTickets}</h1>
                        <h1><span className='font-semibold'>Ride Total Price:</span> ${rideTotalPrice}</h1>
                        <div className='flex gap-2'>
                            <h1 className='font-semibold'>Buy Tickets:</h1>
                            <div className='inline-flex h-7'>
                                <button
                                    disabled={rideTotalTickets == 0}
                                    onClick={() => setRideTotalTickets(rideTotalTickets - 1)}
                                    type='button'
                                    className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>-</span>
                                </button>
                                <button
                                    onClick={() => setRideTotalTickets(rideTotalTickets + 1)}
                                    type='button'
                                    disabled={!canBuyTickets}
                                    className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <button
                    className="flex w-full justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed"
                    disabled={rideTotalTickets == 0}
                    onClick={buyRide}
                >
                    Confirm Ride
                </button>
            </div>

             {/* Modal */}
            {isPaymentModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='w-[40%] rounded-lg ring-1 p-7 bg-white'>
                        <h1 className='font-medium text-xl text-center'>Addd Payment Details.</h1>
                        <hr />
                        <div className='mt-2 space-y-2'>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    Card Number:
                                </label>
                                <input
                                    type="number"
                                    name="cardNumber"
                                    id='cardNumber'
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    Holder Name:
                                </label>
                                <input
                                    type="text"
                                    name="holderName"
                                    id='holderName'
                                    onChange={(e) => setHolderName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    CVV:
                                </label>
                                <input
                                    type="number"
                                    name="cvv"
                                    id='cvv'
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                        </div>
                        <div className='flex justify-end gap-2'>
                            <button
                                type="button"
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                                Cancel
                            </button>

                            <button
                                type='button'
                                onClick={() => { confirmPurchase() }}
                                disabled={isPurchaseButtonDisabled}
                                className='flex justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                            >
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            )}   

        </div>
    )
}
