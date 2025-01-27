import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backendUrl } from '../constants'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/reducers/authSlice';

export default function CustomerLogin() {

    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/users/CustomerLogin`, { email, password }, { withCredentials: true });
            const data = response.data;
            data.currentUser.is_admin = false;
            dispatch(setUser(data.currentUser));
            dispatch(setToken(data.token));
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Wrong email or password. Please try again.');
            }
            else if (error.response && error.response.status === 404) {
                setError('User Not Found!!. Please register..');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
        // const response = await axios.post(`${backendUrl}/users/login`, { email, password }, { withCredentials: true });
        // const data = response.data;
        // dispatch(setUser(data.currentUser));
        // dispatch(setToken(data.token));
        // navigate('/home');
    };

    return (
        <div className='flex flex-col space-y-5 w-full justify-center items-center h-screen'>
            {error &&
                <div class="bg-yellow-100 border border-yellow-400 flex w-[30%] text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Error: </strong>
                    <span class="block sm:inline"> {error}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg class="fill-current h-6 w-6 text-yellow-700" onClick={() => setError(null)} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            }

            <div className='w-96 rounded-lg bg-slate-50 shadow-[0px_1px_20px_-3px_rgb(80,60,60)] p-9'>

                <h1 className='text-xl mb-3 text-center'>Sign in to your account</h1>
                <form className="space-y-4" method="POST">
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#503C3C]"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#503C3C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7E6363]"
                            onClick={(e) => handleLogin(e)}
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to={'/customerRegister'} className="font-semibold leading-6 text-[#503C3C] hover:text-[#7E6363]">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
