import { fetcher } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ViewIcon from '@/public//icon/view.png'
import HideIcon from '@/public//icon/hide.png'

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;

    const [data, setData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isShow, setIsShow] = useState({ password: false, confirmPassword: false })


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (data.password !== data.confirmPassword) {
            setError("Password and Confirm Password does not match.")
        }
        else {
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newPassword: data.password,
                        token: token
                    }),
                }
            );
            if (responseData?.status) {
                setSuccess("Password changed successfully.")

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
                            Change Password
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                                <input
                                    type={isShow.password ? 'text' : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required={true}
                                    value={data.password}
                                    onChange={handleChange}
                                />

                                {
                                    isShow.password ?
                                        <Image src={HideIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow({ ...isShow, password: false })} />
                                        :
                                        <Image src={ViewIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow({ ...isShow, password: true })} />
                                }                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                                <input
                                    type={isShow.confirmPassword ? 'text' : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required={true}
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                />
                                {
                                    isShow.confirmPassword ?
                                        <Image src={HideIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow({ ...isShow, confirmPassword: false })} />
                                        :
                                        <Image src={ViewIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow({ ...isShow, confirmPassword: true })} />
                                }
                            </div>

                            {error && <p style={{ color: '#ff5151', fontSize: 12 }}>{error}</p>}
                            {success && <p style={{ color: '#40af6b', fontSize: 12 }}>{success}</p>}

                            <button
                                type="submit"
                                style={{ backgroundColor: '#919191' }}
                                className="w-full text-white bg-orange-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Save Password
                            </button>

                            <div className="flex items-center justify-center py-4 text-center">
                                {/* <span className="text-sm text-gray-600">{"Don't have an account?"}</span> */}

                                <Link href={'/sign-in'}
                                    style={{ color: '#919191' }}
                                    className="mx-2 text-sm  text-gray-400	font-bold text-blue-500 hover:underline">
                                    Ready to Sign in?
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
