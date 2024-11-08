import { fetcher } from '@/lib/api';
import { setToken } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function ForgotPassword() {
    const [data, setData] = useState({
        email: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.email === '') {
            setError("Email is required")
        } else if (!isValidEmail(data.email)) {
            setError("Incorrect email format"); // Email is not valid, set an error flag
        } else {

            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/send-code`,
                {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: data.email }),
                    method: "POST",
                }
            );

            if (responseData?.status) {
                setSuccess("Success! A verification link is sent to your email.")
            } else if (responseData?.error?.status === 400) {
                setError(responseData.error.message)
            }
        }

    };

    const handleChange = (e) => {
        error && setError("");
        success && setSuccess("");
        setData({ ...data, [e.target.name]: e.target.value });
    };

    function isValidEmail(email) {
        // Regular expression pattern for a valid email address
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        return emailPattern.test(email);
    }

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Flowbite
                </a>
                <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Forgot Password
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Your email"
                                    required={true}
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {error && <p style={{ color: '#ff5151', fontSize: 12 }}>{error}</p>}
                            {success && <p style={{ color: '#40af6b', fontSize: 12 }}>{success}</p>}


                            <button
                                type="submit"
                                style={{ backgroundColor: '#919191' }}
                                className="w-full text-white bg-orange-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Reset Password
                            </button>

                            <div className="flex items-center justify-center py-4 text-center" />

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
