import { fetcher } from '@/lib/api';
import { setToken } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import ViewIcon from '@/public//icon/view.png'
import HideIcon from '@/public//icon/hide.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/Firebase';
import { AppContext } from '@/src/context/AppContext';


export default function SignUp() {

    const router = useRouter()
    const [data, setData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isShow, setIsShow] = useState(false)
    const { dispatch } = useContext(AppContext);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data?.fullName });

            if (userCredential?.user) {

                setToken({
                    id: userCredential?.user?.uid,
                    username: userCredential?.user?.displayName,
                    jwt: userCredential?.user?.accessToken
                })

                dispatch({
                    type: "UPDATE_USER",
                    payload: userCredential?.user
                });

                router.push("/chats");
            }

        } catch (error) {
            console.error('Error signing up:', error.message);
        }

        // const responseData = await fetcher(
        //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             username: data.fullName,
        //             email: data.email,
        //             password: data.password,
        //         }),
        //         method: "POST",
        //     }
        // );
        // if (responseData.error) {
        //     const message = responseData.error.message
        //         ? responseData.error.message
        //         : "Something went wrong please retry.";
        //     setError((err) => err = message)
        //     return;
        // }
        // setToken(responseData);
        // if (responseData?.user) {
        //     router.push("/chats");
        // }
    };

    const handleChange = (e) => {
        error && setError("");
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
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Your name"
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Your email"
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input
                                    type={isShow ? 'text' : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required={true}
                                    onChange={handleChange}
                                />
                                {
                                    isShow ?
                                        <Image src={HideIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow(false)} />
                                        :
                                        <Image src={ViewIcon} alt='password' height={18} width={18} className='absolute right-2.5 bottom-2.5' onClick={() => setIsShow(true)} />
                                }
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <button
                                type="submit"
                                style={{ backgroundColor: '#919191' }}
                                className="w-full text-white bg-orange-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Create an account
                            </button>
                            <div className="flex items-center justify-center py-4 text-center">
                                <span className="text-sm text-gray-600">Already have an account? </span>

                                <Link href={'/sign-in'}
                                    style={{ color: '#919191' }}
                                    className="mx-2 text-sm  text-gray-400	font-bold text-blue-500 hover:underline">
                                    Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
