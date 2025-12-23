"use client"
import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

const Login = () => {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        document.title = "Login - Get Me A Chai"
        if (session) {
            router.push("/dashboard")
        }
    }, [session, router])

    return (
        <div className='text-white py-14 container mx-auto'>
            <h2 className='font-bold text-3xl text-center'> Login to Get Started</h2>

            <div className="flex flex-col gap-2 min-h-screen items-center p-10">

                {/* Google */}
                <button className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-0.5 0 48 48"
                    >
                        <g fill="none" fillRule="evenodd">
                            <path
                                d="M9.8 24c0-1.52.25-2.98.7-4.36L2.6 13.6C1.1 16.7.2 20.26.2 24c0 3.74.87 7.26 2.4 10.39l7.9-6.05c-.45-1.36-.7-2.82-.7-4.34"
                                fill="#FBBC05"
                            />
                            <path
                                d="M23.7 10.13c3.31 0 6.3 1.17 8.65 3.1l6.84-6.83C35 2.77 29.7.53 23.7.53 14.43.53 6.45 5.84 2.62 13.6l7.9 6.04c1.82-5.53 7.02-9.51 13.18-9.51"
                                fill="#EB4335"
                            />
                            <path
                                d="M23.7 37.87c-6.16 0-11.35-3.98-13.18-9.51l-7.9 6.04C6.45 42.16 14.43 47.47 23.7 47.47c5.73 0 11.2-2.04 15.31-5.85l-7.51-5.8c-2.12 1.34-4.79 2.05-7.8 2.05"
                                fill="#34A853"
                            />
                            <path
                                d="M46.15 24c0-1.39-.22-2.88-.53-4.27H23.7v9.07h12.6c-.63 3.09-2.35 5.46-4.79 6.99l7.51 5.8C43.34 37.61 46.15 31.65 46.15 24"
                                fill="#4285F4"
                            />
                        </g>
                    </svg>
                    <span>Continue with Google</span>
                </button>

                {/* LinkedIn */}
                <button className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#0A66C2"
                            d="M20.45 20.45h-3.55v-5.4c0-1.29 0-2.95-1.8-2.95s-2.07 1.4-2.07 2.85v5.5H9.48V9h3.41v1.56h.05c.47-.89 1.62-1.82 3.34-1.82 3.57 0 4.23 2.35 4.23 5.4v6.3zM5.34 7.43a2.06 2.06 0 110-4.11 2.06 2.06 0 010 4.11zm1.78 13.02H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.27V1.72C24 .77 23.2 0 22.23 0z"
                        />
                    </svg>
                    <span>Continue with LinkedIn</span>
                </button>


                {/* Twitter */}
                <button className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -4 48 48"
                    >
                        <path
                            fill="#00AAEC"
                            d="M48 9.1a19.3 19.3 0 01-5.5 1.5 9.6 9.6 0 004.2-5.3 19.2 19.2 0 01-6.1 2.3 9.6 9.6 0 00-16.4 8.7A27.3 27.3 0 013.2 6.2a9.6 9.6 0 003 12.8 9.5 9.5 0 01-4.3-1.2v.1a9.6 9.6 0 007.7 9.4 9.6 9.6 0 01-4.3.2 9.6 9.6 0 009 6.7A19.3 19.3 0 010 41.6a27.2 27.2 0 0014.7 4.3c17.6 0 27.2-14.6 27.2-27.2v-1.2A19.4 19.4 0 0048 9.1z"
                        />
                    </svg>
                    <span>Continue with Twitter</span>
                </button>

                {/* Facebook */}
                <button className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#4460A0"
                            d="M24 0C10.7 0 0 10.7 0 24c0 11.9 8.8 21.7 20.3 23.6v-16.7h-6.1v-6.9h6.1v-5.3c0-6.1 3.6-9.5 9.2-9.5 2.7 0 5.5.5 5.5.5v6.1h-3.1c-3.1 0-4 1.9-4 3.9v4.4h6.8l-1.1 6.9h-5.7V48C39.2 45.7 48 35.9 48 24 48 10.7 37.3 0 24 0z"
                        />
                    </svg>
                    <span>Continue with Facebook</span>
                </button>

                {/* GitHub */}
                <button onClick={() => { signIn("github") }} className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#000"
                            d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.6v-2c-3.3.7-4-1.6-4-1.6a3.1 3.1 0 00-1.3-1.7c-1-.7.1-.7.1-.7a2.4 2.4 0 011.8 1.2 2.4 2.4 0 003.3 1 2.4 2.4 0 01.7-1.5c-2.7-.3-5.6-1.4-5.6-6a4.7 4.7 0 011.2-3.2 4.4 4.4 0 01.1-3.2s1-.3 3.2 1.2a11.1 11.1 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2a4.4 4.4 0 01.1 3.2 4.7 4.7 0 011.2 3.2c0 4.7-2.9 5.6-5.6 6a2.7 2.7 0 01.8 2.1v3.1c0 .4.2.7.8.6A12 12 0 0012 .3"
                        />
                    </svg>
                    <span>Continue with GitHub</span>
                </button>

                {/* Apple */}
                <button className="flex items-center w-64 bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg
                        className="h-6 w-6 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill="#000"
                            d="M16.36 13.45c-.3.7-.66 1.32-1.08 1.85a9 9 0 01-1.34 1.43c-.5.47-1.03.72-1.61.76-.4 0-.9-.1-1.5-.3a4.6 4.6 0 00-1.7-.3c-.6 0-1.1.1-1.5.3-.6.2-1.1.3-1.5.3-.6 0-1.2-.3-1.7-.8a9.9 9.9 0 01-1.3-1.5c-.4-.5-.7-1.1-1-1.8-.3-.8-.5-1.7-.5-2.7 0-1 .2-1.9.6-2.6a4.5 4.5 0 011.8-1.7c.5-.2 1.1-.4 1.6-.4.6 0 1.2.1 1.7.3.5.2 1 .3 1.4.3.4 0 .9-.1 1.5-.3.6-.2 1.1-.3 1.6-.3.6 0 1.1.2 1.6.5.5.3 1 .8 1.3 1.4-.5.3-.9.7-1.1 1.2-.2.6-.3 1.2-.3 1.9 0 .7.1 1.3.3 1.9.2.6.6 1 .9 1.4zM12.3 2.6c0 .6-.2 1.2-.6 1.8-.5.7-1.2 1.2-2.1 1.2a2.3 2.3 0 01-.1-.6c0-.6.2-1.2.6-1.8.4-.6 1.2-1.2 2.2-1.2 0 .2 0 .4 0 .6z"
                        />
                    </svg>
                    <span>Continue with Apple</span>
                </button>






            </div>
        </div>
    )
}

export default Login


