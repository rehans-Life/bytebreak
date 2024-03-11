'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { logout } from '../../utils/api';
import Loading from './loading';
import useUser from '@/hooks/useUser';
import defaultPhoto from '@/utils/defaultPhoto';

const styles = {
    activeLink: 'font-medium before:block before:bg-white before:absolute before:bottom-0 before:w-full before:h-[2px]',
}

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useUser();
    const paths = ["problems", "create-problem"] as const;

    const { mutate, isPending } = useMutation({
        meta: {
            onSuccess: () => {
                setUser(undefined);
            }
        },
        mutationFn: logout
    });

    return (!pathname.match(new RegExp(/\/problems\/.+/)) ?
        <div className='md:px-5 sm:py-0 py-3 px-3 relative bg-dark-layer-3 border-b border-dark-border flex flex-col gap-y-2 sm:flex-row items-center justify-between'>
            <div className="flex items-center gap-x-7 text-white">
                <Link href={'/'}>
                    <Image height={1080} width={1080} src="/logo.png" alt="log" className="w-6 h-6 object-contain" />
                </Link>
                {paths.map((name, i) => {
                    const path = `/${name}`;
                    return <Link key={i} href={path} className={`${pathname === path ? styles.activeLink : ""} relative text-sm py-4 capitalize`}>
                        {name.replace(/-/g, ' ')}
                    </Link>
                })}
            </div>
            <div className="flex items-center gap-x-4">
                {
                    user
                        ? <>
                            <Link href={`/${user?.username}`}>
                                <Image height={500} width={500} src={user.photo || defaultPhoto} alt="profile-photo" className="w-6 h-6 object-contain cursor-pointer rounded-full" />
                            </Link>
                            <button
                                disabled={isPending}
                                onClick={() => mutate(undefined)}
                                className='rounded-md text-sm py-2 px-3 text-dark-label-2 hover:bg-dark-fill-2'>
                                {isPending ? <Loading /> : 'Logout'}
                            </button>
                        </>
                        : <div className="text-dark-label-2 text-sm flex items-center gap-x-1">
                            <Link href={'/signup'} className='rounded-md py-2 px-3 text-dark-label-2 hover:text-white'>
                                Register
                            </Link>
                            or
                            <Link href={'/login'} className='rounded-md py-2 px-3 text-dark-label-2 hover:text-white'>
                                Login
                            </Link>

                        </div>
                }
            </div>
        </div>
    : <></>) 
}
