"use client";
import { BsHouse } from '@react-icons/all-files/bs/BsHouse'
import Link from 'next/link'

export default function FallbackError() {
    return <div className="bg-dark-gray-8 h-screen flex items-center justify-center">
        <div className="flex sm:flex-row flex-col items-center gap-3">
            <img className='w-60 h-36 object-contain' src="https://leetcode.com/static/images/404_face.png" alt="error-404" />
            <div className="flex flex-col gap-y-6 sm:items-start items-center text-dark-layer-2">
                <div className='flex flex-col gap-y-1.5 sm:items-start items-center'>
                    <div className="sm:text-3xl text-2xl font-bold">Page Not Found</div>
                    <div className="sm:text-md text-sm">Sorry, but we can&apos;t find the page you are looking for...</div>
                </div>
                <Link href="/">
                    <button className="sm:text-md border-black hover:bg-dark-label-2 border rounded-md text-sm flex items-center gap-x-2 p-2">
                        <BsHouse />
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    </div>
}