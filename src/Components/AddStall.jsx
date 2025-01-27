import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';





export default function AddStall() {

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [stallType, setStallType] = useState("Ride");
  const [stallImage, setStallImage] = useState(null);
  const [totalTickets, setTotalTickets] = useState();
  const [description, setDescription] = useState();
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const accessToken = useSelector((state) => state.user.token);
  const navigate = useNavigate();



  function handleAddStall() {
    axios.post(`${backendUrl}/stalls/addStall`,
      {
        name, 
        price, 
        stallType, 
        image:stallImage, 
        totalTickets,  
        description
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(()=>{
      navigate('/home');
    });
  }

  useEffect(() => {
    const isFormValid = name && stallType && price && stallImage && totalTickets && description;
    setIsAddDisabled(!isFormValid);
  }, [name, stallType, price, stallImage, totalTickets, description]);

  return (
    <div className='flex justify-center items-center h-screen pt-16'>
      <div className='w-[40%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] p-9'>
        <h1 className='font-medium text-xl text-center'>Add Stall</h1>
        <form action="" method='POST' className='space-y-3'>
          <div className='flex items-center gap-3 mt-3'>
            <div className='flex items-center gap-2 w-96'>
              <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor="price" className="text-sm font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
                <input
                  type="number"
                  name="price"
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 justify-between'>
            <label htmlFor="stallType" className="text-sm float-start font-medium leading-6 text-gray-900">
              Stall Type
            </label>
            <select
              name='stallType'
              onChange={(e) => setStallType(e.target.value)}
              class="block w-96 p-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]">
              <option value="Ride" selected>Ride</option>
              <option value="Activity">Activity</option>
            </select>
          </div>

          <div className='flex items-center gap-2 justify-between'>
            <label htmlFor="stallImage" className="text-sm float-start font-medium leading-6 text-gray-900">
              Stall Image
            </label>
            <input
              type="file"
              name="image"
              id="stallImage"
              onChange={(e) => setStallImage(e.target.files[0])}
              className="block w-96 p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
            />
          </div>

          <div className='flex items-center gap-2 justify-between'>
            <label htmlFor="totalNoOfTickets" className="text-sm float-start font-medium leading-6 text-gray-900">
              Total No.Of Tickets
            </label>

            <input
              type="Number"
              name="totalNoOfTickets"
              id="totalNoOfTickets"
              onChange={(e) => setTotalTickets(e.target.value)}
              className="block w-96 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Description
            </label>
          </div>
          <div>
            <textarea
              name="description"
              id="description"
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
            />
          </div>

          <button
            type="button"
            disabled={isAddDisabled}
            onClick={handleAddStall}
            className="flex w-full justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed"
          >
            Add Stall
          </button>
        </form>
      </div>
    </div>
  )
}