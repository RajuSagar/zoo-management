import React from 'react'
import { backendImageUrl, backendUrl } from '../constants'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Stall({ stall, selectStall, userData }) {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.user.token);

  function handleDisable() {
    axios.put(`${backendUrl}/stalls/editStallStatus/${stall._id}`,
      {
        status: "disabled"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(() => {
        window.location.reload();
      });
  }


  return (
    <div className='w-72 rounded-md bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] flex flex-col'>
      <div className='h-56 rounded-t-md shadow-[0px_3px_15px_-5px_rgb(0,0,0)] relative'>
        <img src={backendImageUrl + `/${stall.image}`} alt="" className='w-full h-full rounded-t-md' />
      </div>
      <div className='p-4'>
        <h3 className='font-bold text-center text-lg'>{stall.name}</h3>
        <h4><span className='font-semibold'>Price:</span> ${stall.price}</h4>
        {stall.totalTickets > 0 ? <h1><span className='font-semibold'>Tickets Available:</span> {stall.totalTickets}</h1> : <h1 className='font-semibold'>Sold Out!!</h1>}
        <h1 className='font-semibold'>Description:</h1>
        <div className='px-1'>
          <p>{stall.description}</p>
        </div>
        {!userData.is_admin && stall.totalTickets > 0 &&
          <button
            onClick={() => selectStall(stall._id)}
            className='rounded-md bg-[#503C3C] px-4 py-1 float-end mt-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]'
          >
            Buy
          </button>
        }
        {
          userData.is_admin &&
          <div className='flex justify-end mt-3'>
            <button
              type="button"
              onClick={() => navigate(`/editStall/${stall._id}`)}
              className="flex justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 sm:ml-3 sm:w-auto">
              Edit
            </button>
            <button
              onClick={()=> handleDisable()}
              type="button"
              className="flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 sm:ml-3 sm:w-auto">
              Disable
            </button>
          </div>
        }
      </div>

    </div>
  )
}
