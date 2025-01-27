import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function BuyTicket() {

    const userData = useSelector((state) => state.user.user);
    const [adultInput, setAdultInput] = useState([]);
    const [childrenInput, setChildrenInput] = useState([]);
    const [seniorInput, setSeniorInput] = useState([]);
    const [handicappedInput, setHandicappedInput] = useState([]);
    const [ticket, setTicket] = useState(null);
    const accessToken = useSelector((state) => state.user.token);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [isPurchaseButtonDisabled, setIsPurchaseButtonDisabled] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [availableTickets, setAvailableTickets] = useState(null);
    const [canAddPersons, setCanAddPersons] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [cardNumber, setCardNumber] = useState(null);
    const [holderName, setHolderName] = useState(null);
    const [cvv, setCvv] = useState(null);
    const [availableDate, setAvailableDate] = useState([schedules[0]?._id]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { ticketId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${backendUrl}/tickets/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setTicket(res.data);
                setAvailableTickets(res.data.totalNoOfTickets);
            })

        axios.get(`${backendUrl}/tickets/activeSchedules`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setSchedules(res.data);
                setAvailableDate(res.data[0]._id);
            })
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            axios.get(`${backendUrl}/tickets/ticketsCount/${ticketId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res) => {
                    setAvailableTickets(res.data);
                })
        }, 1000);

        return () => clearInterval(timer);
    }, [ticket]);

    useEffect(() => {
        if (availableTickets) {
            if (totalTickets >= availableTickets) {
                setCanAddPersons(false);
            }
            else {
                setCanAddPersons(true);
            }
        }
    }, [totalTickets]);


    const addAdultInput = () => {
        setAdultInput([...adultInput, { name: '', age: '' }]);
    };

    const removeAdultInput = () => {
        const updatedInputs = [...adultInput];
        updatedInputs.splice(adultInput.length - 1, 1);
        setAdultInput(updatedInputs);
    };

    const handleAdultChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'age' && value <= 50 && value >= 0) {
            const updatedInputs = [...adultInput];
            updatedInputs[index][name] = value;
            setAdultInput(updatedInputs);
        }
        else if (name === 'name') {
            const updatedInputs = [...adultInput];
            updatedInputs[index][name] = value;
            setAdultInput(updatedInputs);
        }
    };
    const addChildrenInput = () => {
        setChildrenInput([...childrenInput, { name: '', age: '' }]);
    };

    const removeChildrenInput = () => {
        const updatedInputs = [...childrenInput];
        updatedInputs.splice(childrenInput.length - 1, 1);
        setChildrenInput(updatedInputs);
    };

    const handleChildrenChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'age' && value <= 18 && value >= 0) {
            const updatedInputs = [...childrenInput];
            updatedInputs[index][name] = value;
            setChildrenInput(updatedInputs);
        }
        else if (name === 'name') {
            const updatedInputs = [...childrenInput];
            updatedInputs[index][name] = value;
            setChildrenInput(updatedInputs);
        }
    };
    const addSeniorInput = () => {
        setSeniorInput([...seniorInput, { name: '', age: '' }]);
    };

    const removeSeniorInput = () => {
        const updatedInputs = [...seniorInput];
        updatedInputs.splice(seniorInput.length - 1, 1);
        setSeniorInput(updatedInputs);
    };

    const handleSeniorChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'age' && value <= 150 && value >= 0) {
            const updatedInputs = [...seniorInput];
            updatedInputs[index][name] = value;
            setSeniorInput(updatedInputs);
        }
        else if (name === 'name') {
            const updatedInputs = [...seniorInput];
            updatedInputs[index][name] = value;
            setSeniorInput(updatedInputs);
        }
    };
    const addHandicappedInput = () => {
        setHandicappedInput([...handicappedInput, { name: '', age: '' }]);
    };

    const removeHandicappedInput = () => {
        const updatedInputs = [...handicappedInput];
        updatedInputs.splice(handicappedInput.length - 1, 1);
        setHandicappedInput(updatedInputs);
    };

    const handleHandicappedChange = (index, event) => {
        const { name, value } = event.target;
        if (name === 'age' && value <= 150 && value >= 0) {
            const updatedInputs = [...handicappedInput];
            updatedInputs[index][name] = value;
            setHandicappedInput(updatedInputs);
        }
        else if (name === 'name') {
            const updatedInputs = [...handicappedInput];
            updatedInputs[index][name] = value;
            setHandicappedInput(updatedInputs);
        }
    };

    function confirmPurchase() {
        axios.post(`${backendUrl}/tickets/buyTicket`,
            {
                customer: userData._id,
                ticket: ticketId,
                adultTickets: adultInput,
                seniorTickets: seniorInput,
                childrenTickets: childrenInput,
                handicappedTickets: handicappedInput,
                totalTickets,
                totalPrice,
                totalBookingPrice: totalPrice,
                ride: null,
                activity: null,
                status: "Ordered",
                schedule: availableDate
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            }
        )
            .then((res) => {
                axios.post(`${backendUrl}/payments/addPayment`,
                    {
                        booking: res.data._id,
                        customer: userData._id,
                        stall: null,
                        amount: totalPrice,
                        cardNumber,
                        holderName,
                        cvv,
                        totalTickets
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

    function handleBuyTicket(e) {
        e.preventDefault();

        if (totalTickets > availableTickets) {
            window.alert("Sorry We Don't have any tickets");
            window.location.reload();
        }
        else {
            setIsPaymentModalOpen(true);
        }

    }


    useEffect(() => {
        var wholePrice = 0;
        var wholeTickets = 0;
        // Enable or disable the Add button based on the form validity
        const isFormValid = (adultInput.length > 0 || childrenInput.length > 0 || seniorInput.length > 0 || handicappedInput.length > 0) &&
            (adultInput.every(input => input.name && input.age)
                && childrenInput.every(input => input.name && input.age)
                && seniorInput.every(input => input.name && input.age)
                && handicappedInput.every(input => input.name && input.age));
        setIsAddButtonDisabled(!isFormValid);

        if (adultInput.length > 0) {
            adultInput.forEach(element => {
                wholeTickets += 1;
                wholePrice += ticket.priceForAdult
            });
        }

        if (childrenInput.length > 0) {
            childrenInput.forEach(element => {
                wholeTickets += 1;
                wholePrice += ticket.priceForChildren
            });
        }

        if (seniorInput.length > 0) {
            seniorInput.forEach(element => {
                wholeTickets += 1;
                wholePrice += ticket.priceForSenior
            });
        }

        if (handicappedInput.length > 0) {
            handicappedInput.forEach(element => {
                wholeTickets += 1;
                wholePrice += ticket.priceForHandicapped
            });
        }

        setTotalPrice(wholePrice);
        setTotalTickets(wholeTickets);

    }, [adultInput, childrenInput, seniorInput, handicappedInput]);


    useEffect(() => {
        const isFormValid = cardNumber && holderName && cvv
        setIsPurchaseButtonDisabled(!isFormValid);
    }, [cardNumber, holderName, cvv]);

    return (
        <div className='flex justify-center items-center h-full pt-16'>
            <div className='w-[35%] rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] mt-11 my-5 p-9'>
                <h1 className='font-medium text-xl text-center mb-2'>Buy Ticket</h1>
                <hr />
                {ticket &&
                    <div className='my-2'>
                        <h1><span className='font-semibold'>Ticket Name:</span> {ticket.name}</h1>
                        <div className='flex flex-wrap justify-between mb-2'>
                            <h1 className='w-52'><span className='font-semibold'>Price for Adult:</span> ${ticket.priceForAdult}</h1>
                            <h1><span className='font-semibold'>Price for Children:</span> ${ticket.priceForChildren}</h1>
                            <h1><span className='font-semibold'>Price for Senior:</span> ${ticket.priceForSenior}</h1>
                            <h1><span className='font-semibold'>Price for Handicapped:</span> ${ticket.priceForHandicapped}</h1>
                        </div>
                        <h1 className='text-center'><span className='font-semibold'>Available Tickets:</span> {availableTickets}</h1>
                        <hr />
                        <div className='flex justify-between items-center mt-2'>
                            <h1><span className='font-semibold'>Total Tickets:</span> {totalTickets}</h1>
                            <h1><span className='font-semibold'>Total Price:</span> ${totalPrice}</h1>
                        </div>

                    </div>
                }
                <form action="" method='POST'>
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
                        <div className='flex justify-between items-center mb-1'>
                            <h1 className='font-semibold'>Add Tickets for Adults</h1>
                            <div className='inline-flex h-7'>
                                <button
                                    type='button'
                                    onClick={removeAdultInput}
                                    className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                    disabled={adultInput.length <= 0}
                                >
                                    <span className='font-bold'>-</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={addAdultInput}
                                    disabled={!canAddPersons}
                                    className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>+</span>
                                </button>
                            </div>
                        </div>
                        <hr />
                        {adultInput.map((input, index) => (
                            <div key={index} className='flex items-center gap-2 mt-1'>
                                <label htmlFor={`name-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id={`name-${index}`}
                                    onChange={(e) => handleAdultChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                                <label htmlFor={`age-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Age:
                                </label>
                                <input
                                    type="number"
                                    id={`age-${index}`}
                                    name='age'
                                    max={50}
                                    value={adultInput[index]['age']}
                                    onChange={(e) => handleAdultChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
                        <div className='flex justify-between items-center mb-1'>
                            <h1 className='font-semibold'>Add Tickets for Children</h1>
                            <div className='inline-flex h-7'>
                                <button
                                    type='button'
                                    onClick={removeChildrenInput}
                                    className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                    disabled={childrenInput.length <= 0}
                                >
                                    <span className='font-bold'>-</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={addChildrenInput}
                                    disabled={!canAddPersons}
                                    className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>+</span>
                                </button>
                            </div>
                        </div>
                        <hr />
                        {childrenInput.map((input, index) => (
                            <div key={index} className='flex items-center gap-2 mt-1'>
                                <label htmlFor={`name-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id={`name-${index}`}
                                    onChange={(e) => handleChildrenChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                                <label htmlFor={`age-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Age:
                                </label>
                                <input
                                    type="number"
                                    id={`age-${index}`}
                                    name='age'
                                    value={childrenInput[index]['age']}
                                    max={18}
                                    onChange={(e) => handleChildrenChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
                        <div className='flex justify-between items-center mb-1'>
                            <h1 className='font-semibold'>Add Tickets for seniors</h1>
                            <div className='inline-flex h-7'>
                                <button
                                    type='button'
                                    onClick={removeSeniorInput}
                                    className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                    disabled={seniorInput.length <= 0}
                                >
                                    <span className='font-bold'>-</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={addSeniorInput}
                                    disabled={!canAddPersons}
                                    className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>+</span>
                                </button>
                            </div>
                        </div>
                        <hr />
                        {seniorInput.map((input, index) => (
                            <div key={index} className='flex items-center gap-2 mt-1'>
                                <label htmlFor={`name-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id={`name-${index}`}
                                    onChange={(e) => handleSeniorChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                                <label htmlFor={`age-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Age:
                                </label>
                                <input
                                    type="number"
                                    id={`age-${index}`}
                                    name='age'
                                    max={150}
                                    min={50}
                                    defaultValue={50}
                                    value={seniorInput[index]['age']}
                                    onChange={(e) => handleSeniorChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-3 ring-1 ring-[#503C3C] rounded-md p-3'>
                        <div className='flex justify-between items-center mb-1'>
                            <h1 className='font-semibold'>Add Tickets for Handicapped</h1>
                            <div className='inline-flex h-7'>
                                <button
                                    type='button'
                                    onClick={removeHandicappedInput}
                                    className='rounded-l-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                    disabled={handicappedInput.length <= 0}
                                >
                                    <span className='font-bold'>-</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={addHandicappedInput}
                                    disabled={!canAddPersons}
                                    className='rounded-r-md bg-[#503C3C] text-white shadow-sm pb-1 w-6 hover:bg-[#7E6363] ring-1 ring-slate-200 disabled:bg-[#7e6363ad] disabled:cursor-not-allowed'
                                >
                                    <span className='font-bold'>+</span>
                                </button>
                            </div>
                        </div>
                        <hr />
                        {handicappedInput.map((input, index) => (
                            <div key={index} className='flex items-center gap-2 mt-1'>
                                <label htmlFor={`name-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id={`name-${index}`}
                                    onChange={(e) => handleHandicappedChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                                <label htmlFor={`age-${index}`} className="block text-sm float-start font-medium leading-6 text-gray-900">
                                    Age:
                                </label>
                                <input
                                    type="number"
                                    id={`age-${index}`}
                                    name='age'
                                    value={handicappedInput[index]['age']}
                                    onChange={(e) => handleHandicappedChange(index, e)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                                />
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-wrap justify-between gap-3 my-3'>
                        <div className='w-full'>
                            <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
                                Select Available Date & Slot:
                            </label>
                            <select
                                name='stallType'
                                onChange={(e) => setAvailableDate(e.target.value)}
                                class="block w-full p-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]">
                                {
                                    schedules.map((ele, idx) => (
                                        <option value={ele._id} key={idx}>
                                            {new Date(ele.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}

                                            {' ' + ' (' + ele.slot.slot + ')'}
                                        </option>
                                    ))
                                }

                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center mt-4 rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363] disabled:bg-[#7e6363ad] disabled:cursor-not-allowed"
                        disabled={isAddButtonDisabled}
                        onClick={(e) => handleBuyTicket(e)}
                    >
                        Buy Ticket
                    </button>
                </form>
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
