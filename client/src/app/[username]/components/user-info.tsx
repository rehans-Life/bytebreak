import UserInfoSkeleton from '@/skeletons/user-info-skeleton';
import { getUserInfo } from '@/utils/api';
import defaultPhoto from '@/utils/defaultPhoto';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'

export default function UserInfo() {
    const params = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ['user-info', params.username],
        queryFn: getUserInfo
    })

    return (
        <div className='p-3 rounded-lg bg-dark-layer-1 flex flex-col gap-y-2'>
            {isLoading ?
                <UserInfoSkeleton />
                :
                <>
                    <div className='flex items-start gap-x-3'>
                        <Image height={500} width={500} alt='user-photo' src={data?.photo || defaultPhoto} className='rounded-lg w-20 h-20'
                        />
                        <div className='flex flex-col gap-y-1 text-white'>
                            <div className='text-md font-medium break-all'>{data?.username}</div>
                            <div className='text-xs break-all'>{data?.email}</div>
                        </div>
                    </div>
                    <div className='w-full my-2 h-[1px] bg-dark-border'></div>
                    <div className='flex flex-col gap-y-3 text-white'>
                        <div className='font-medium'>Languages</div>
                        <div className='flex flex-col gap-y-2'>
                            {data?.solvedByLang.map(({ language, solved }, i) => <div
                                key={i} className='flex items-center justify-between text-xs'>
                                <div className='px-2 py-1 bg-dark-hover rounded-full text-dark-gray-7'>
                                    {language}
                                </div>
                                <div className='text-white font-medium'>{solved} <span className='text-dark-gray-7 font-normal'>problems solved</span></div>
                            </div>)}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
