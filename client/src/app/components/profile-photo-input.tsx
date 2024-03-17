import React, { ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/utils/api';
import Loading from './loading';
import Image from 'next/image';

export default function ProfilePhotoInput({
    name,
    value,
    onChange,
    onBlur
}: {
    name: string,
    value: string,
    onChange: (value: string) => void,
    onBlur: (event: ChangeEvent) => void
}) {

    const { mutate, isPending } = useMutation<string, any, File>({
        meta: {
            onSuccess: (downloadURL: string) => {
                onChange(downloadURL)
            }
        },
        mutationFn: uploadFile
    })

    return (
        <div className='flex-col flex justify-center items-center gap-y-2'>
            <Image width={1080} height={1080} src={value} alt="profile-picture" className='h-28 w-28 border border-dark-gray-6 rounded-full' />
            {isPending ? <Loading /> : <label htmlFor="profile-photo" className='cursor-pointer flex gap-y-1 items-center flex-col justify-center relative'>
                <div className='text-sm text-dark-gray-7'>Change Profile Photo</div>
                <input type="file" name={name} id='profile-photo' className='hidden' onBlur={onBlur} onChange={(event) => {
                    if (event.target.files?.length) {
                        mutate(event.target.files[0])
                    }
                }} />
            </label>}
        </div>
    )
}
