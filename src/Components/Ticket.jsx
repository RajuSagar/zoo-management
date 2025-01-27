import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backendUrl } from '../constants'
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Ticket({ ticket, user }) {

    const accessToken = useSelector((state) => state.user.token);
    const navigate = useNavigate();

    function changeTicketStatus() {
        axios.put(`${backendUrl}/tickets/changeStatus/${ticket._id}`, {
            status: "Expired"
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        })
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <div className={`flex justify-center items-center ${ticket.status == 'Active' ? '' : 'text-gray-400 cursor-not-allowed opacity-85'}`}>
            <div className='w-[500px] space-y-2 rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] px-5 py-2'>
                <h1 className='text-center font-semibold text-xl'>Ticket Details</h1>
                <hr />
                <div className='text-lg space-y-2'>
                    <h1 className='text-center'>{ticket.name}</h1>
                    <div className='flex flex-wrap gap-2 justify-between'>
                        <h1>Price for Adult: ${ticket.priceForAdult}</h1>
                        <h1>Price for Children: ${ticket.priceForChildren}</h1>
                        <h1>Price for Senior: ${ticket.priceForSenior}</h1>
                        <h1>Price for Handicapped: ${ticket.priceForHandicapped}</h1>
                    </div>
                    {ticket.totalNoOfTickets != 0 ? <h1 className='text-center'>Total No of Tickets: {ticket.totalNoOfTickets}</h1> : <h1 className='text-center'>Sold Out!!</h1>}
                </div>
                <div className='flex justify-end'>
                    {
                        user.is_admin ?
                            ticket.status == 'Active' ?
                                <button
                                    type="button"
                                    onClick={() => navigate('/addTicket')}
                                    className="flex justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 sm:ml-3 sm:w-auto">
                                    Edit
                                </button>
                                :
                                <></>
                            :
                            ticket.totalNoOfTickets == 0 ?
                                <></>
                                :

                                <Link
                                    type='button'
                                    to={`/buyTicket/${ticket._id}`}
                                    className='flex justify-center rounded-md bg-[#503C3C] px-4 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]'
                                >
                                    Buy
                                </Link>

                    }
                </div>
            </div>
        </div>
    )
}
