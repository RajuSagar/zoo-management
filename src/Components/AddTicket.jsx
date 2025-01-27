import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'

export default function AddTicket() {
  const [name, setName] = useState(null);
  const [priceForAdult, setPriceForAdult] = useState(null);
  const [priceForChildren, setPriceForChildren] = useState(null);
  const [priceForSenior, setPriceForSenior] = useState(null);
  const [priceForHandicapped, setPriceForHandicapped] = useState(null);
  const [totalNoOfTickets, setTotalNoOfTickets] = useState(null);
  const accessToken = useSelector((state) => state.user.token);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [doesTicketExist, setDoesTicketExist] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const navigate = useNavigate();

  function handleAddTicket(e) {
    e.preventDefault();

    if(!doesTicketExist){

      axios.post(`${backendUrl}/tickets/addTicket`,
        {
          name,
          priceForAdult,
          priceForChildren,
          priceForSenior,
          priceForHandicapped,
          totalNoOfTickets
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      )
        .then(() => {
          axios.post(`${backendUrl}/tickets/addSchedules`,
            {
              schedules: availableTickets
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
            }
          )
            .then(() => {
  
            })
          navigate('/home');
        })
    }
    else{
      axios.put(`${backendUrl}/tickets/editTicket/${currentTicket._id}`,
        {
          name,
          priceForAdult,
          priceForChildren,
          priceForSenior,
          priceForHandicapped,
          totalNoOfTickets
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      )
        .then(() => {
          axios.post(`${backendUrl}/tickets/addSchedules`,
            {
              schedules: availableTickets
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
            }
          )
            .then(() => {
  
            })
          navigate('/home');
        })
    }
  }

  const allSchedules = () => {
    axios.get(`${backendUrl}/tickets/activeSchedules`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          const groupedSchedules = res.data.reduce((acc, schedule) => {
            const date = schedule.date.split("T")[0]; // Extract date part
            if (!acc[date]) {
              acc[date] = { date, slots: [] };
            }
            acc[date].slots.push({value:schedule.slot._id,label:schedule.slot.slot});
            return acc;
          }, {});

          const groupedSchedulesArray = Object.values(groupedSchedules);
          setAvailableTickets(groupedSchedulesArray);
        }
      });
  };

  function checkTicketExist() {
    axios.get(`${backendUrl}/tickets/allTickets`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          setDoesTicketExist(true);
          setCurrentTicket(res.data[0])
        }
      });
  }

  const addScheduleInput = () => {
    setAvailableTickets([...availableTickets, { date: '', slots: [] }]);
  };

  const removeScheduleInput = () => {
    const updatedInputs = [...availableTickets];
    updatedInputs.splice(availableTickets.length - 1, 1);
    setAvailableTickets(updatedInputs);
  };

  const allSlots = () => {
    axios.get(`${backendUrl}/tickets/allSlots`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        setSlots(res.data);
      });
  }

  const addSlot = () => {
    axios.post(`${backendUrl}/tickets/addSlot`,
      {
        slot: newSlot,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      }
    )
      .then(() => {
        setIsModalOpen(false);
        allSlots();
      })
  }

  const handleScheduleChange = (index, event, values) => {
    if (event != null) {
      const { name, value } = event.target;
      const updatedInputs = [...availableTickets];
      updatedInputs[index][name] = value;
      setAvailableTickets(updatedInputs);
    }
    else {
      const updatedInputs = [...availableTickets];
      updatedInputs[index]['slots'] = values;
      setAvailableTickets(updatedInputs);
    }
  };

  useEffect(() => {
    allSlots();
    checkTicketExist();
  }, [])

  useEffect(() => {
    if (doesTicketExist) {
      allSchedules();
      setName(currentTicket.name);
      setPriceForAdult(currentTicket.priceForAdult);
      setPriceForChildren(currentTicket.priceForChildren);
      setPriceForHandicapped(currentTicket.priceForHandicapped);
      setPriceForSenior(currentTicket.priceForSenior);
      setTotalNoOfTickets(currentTicket.totalNoOfTickets);
    }
  }, [doesTicketExist])

  useEffect(() => {
    // Enable or disable the Add button based on the form validity
    const isFormValid = name && priceForAdult && priceForChildren && priceForSenior && priceForHandicapped && totalNoOfTickets && availableTickets.length > 0 && availableTickets.every(input => input.date && input.slots.length > 0);
    setIsAddButtonDisabled(!isFormValid);

  }, [name, priceForAdult, priceForChildren, priceForSenior, priceForHandicapped, totalNoOfTickets, availableTickets]);

  return (
    <div className='flex flex-col justify-center items-center h-screen pt-16'>
      {doesTicketExist && <h1 className='text-xl font-semibold my-3'>Note: You already have a ticket so you can edit it.</h1>}
      <div className='w-[40%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] p-9'>
        <h1 className='font-medium text-xl text-center'> {doesTicketExist ? 'Edit Ticket' : 'Add Ticket'}</h1>
        <form action="" method='POST'>
          <div className='flex items-center gap-2 mt-3'>
            <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
            />
          </div>

          <div className='flex flex-wrap justify-between gap-3 my-3'>
            <div className="flex items-center gap-2">
              <label htmlFor="priceForAdult" className="block text-sm font-medium leading-6 text-gray-900">
                Price for Adult:
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="px-3 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
                <input
                  type="number"
                  name="priceForAdult"
                  id="priceForAdult"
                  value={priceForAdult}
                  onChange={(e) => setPriceForAdult(e.target.value)}
                  className="block w-20 rounded-e-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="priceForChildren" className="block text-sm font-medium leading-6 text-gray-900">
                Price for Children:
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="px-3 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
                <input
                  type="number"
                  name="priceForChildren"
                  id="priceForChildren"
                  value={priceForChildren}
                  onChange={(e) => setPriceForChildren(e.target.value)}
                  className="block w-20 rounded-e-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="priceForSenior" className="block text-sm font-medium leading-6 text-gray-900">
                Price for Senior:
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="px-3 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
                <input
                  type="number"
                  name="priceForSenior"
                  id="priceForSenior"
                  value={priceForSenior}
                  onChange={(e) => setPriceForSenior(e.target.value)}
                  className="block w-20 rounded-e-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="priceForHandicapped" className="block text-sm font-medium leading-6 text-gray-900">
                Price for Handicapped:
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="px-3 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
                <input
                  type="number"
                  name="priceForHandicapped"
                  id="priceForHandicapped"
                  value={priceForHandicapped}
                  onChange={(e) => setPriceForHandicapped(e.target.value)}
                  className="block w-20 rounded-e-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <label htmlFor="totalNoOfTickets" className="w-40 text-sm float-start font-medium leading-6 text-gray-900">
              Total No.Of Tickets
            </label>

            <input
              type="Number"
              name="totalNoOfTickets"
              id="totalNoOfTickets"
              value={totalNoOfTickets}
              onChange={(e) => setTotalNoOfTickets(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6"
            />
          </div>

          <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
            <div className='flex justify-between items-center mb-1'>
              <h1 className='font-semibold'>Add Available Dates</h1>
              <div className='inline-flex h-7'>
                <button
                  type='button'
                  onClick={removeScheduleInput}
                  className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                  disabled={availableTickets.length <= 0}
                >
                  <span className='font-bold'>-</span>
                </button>
                <button
                  type='button'
                  onClick={addScheduleInput}
                  className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                >
                  <span className='font-bold'>+</span>
                </button>
              </div>
            </div>
            <hr />
            {availableTickets.map((input, index) => (
              <div key={index} className='flex items-center gap-2 mt-1'>
                <label htmlFor={`name-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                  Date:
                </label>
                <input
                  type="date"
                  name="date"
                  id={`date-${index}`}
                  value={availableTickets[index]['date']}
                  onChange={(e) => handleScheduleChange(index, e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                />
                <label htmlFor={`age-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                  Slots:
                </label>
                <Select
                  isMulti
                  name="slots"
                  id={`slots-${index}`}
                  value={availableTickets[index]['slots']}
                  options={slots.map(item => ({ value: item._id, label: item.slot }))}
                  className="basic-multi-select block w-full"
                  onChange={(selectedOptions) => handleScheduleChange(index, null, selectedOptions)}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="flex w-full justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed"
            onClick={() => { setIsModalOpen(true) }}
          >
            Add Slots
          </button>

          <button
            type="submit"
            className="flex w-full justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed"
            onClick={(e) => { handleAddTicket(e) }}
            disabled={isAddButtonDisabled}
          >
             {doesTicketExist ? 'Edit Ticket' : 'Add Ticket'}
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-9 bg-white'>
            <h1 className='font-medium text-xl'>{`Add Slots here..`}</h1>
            <div>
              <label htmlFor='modalInput' className='block text-sm float-start font-medium leading-6 text-gray-900'>
                Name
              </label>
            </div>
            <div>
              <input
                type='text'
                name='newSlot'
                id='newSlot'
                onChange={(e) => setNewSlot(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false) }}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Cancel
              </button>

              <button
                type='button'
                onClick={() => { addSlot() }}
                className='flex justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
