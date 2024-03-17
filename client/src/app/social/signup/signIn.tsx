'use client';

import Input from '@/app/components/input';
import Loading from '@/app/components/loading';
import styles from '@/app/styles';
import { IGoogleUser, IUser, userAtom } from '@/atoms/userAtom';
import { createGoogleUser } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { auth } from '../../../../firebase';
import defaultPhoto from '@/utils/defaultPhoto';
import ProfilePhotoInput from '@/app/components/profile-photo-input';

const SignInSchema = z.object({
    email: z.string().min(1),
    username: z.string().min(1),
    photo: z.string(),
    uuid: z.string()
})

export type SignInFormType = z.infer<typeof SignInSchema>;

export default function SignIn() {
    const router = useRouter();
    const [user] = useState(auth.currentUser)
    const setUser = useSetAtom(userAtom);

    const { register, handleSubmit, control, reset, formState: { isValid  } } = useForm<SignInFormType>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: user?.displayName || "",
            email: user?.email || "",
            photo: user?.photoURL || defaultPhoto,
            uuid: user?.uid
        }
    })

    const onSuccess = async (user: IUser) => {
        setUser(user);
        router.push('/problems');
    }

    const { mutate, isPending } = useMutation<IUser, any, IGoogleUser>({
        meta: {
            onSuccess
        },
        mutationFn: createGoogleUser
    })

    const submit: SubmitHandler<SignInFormType> = ({ email, username, photo, uuid }) => {
        mutate({
            email,
            username,
            photo,
            userId: uuid
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            reset({
                email: user?.email || "",
                photo: user?.photoURL || defaultPhoto,
                username: user?.displayName || "",
                uuid: user?.uid || ''
            })
        });
    }, [])
    

    return (
        <form className="py-8 flex justify-center items-center h-full" onSubmit={handleSubmit(submit)}>
            <div className='bg-dark-border max-w-full w-96 rounded-sm px-3 py-6 flex flex-col gap-y-5 shadow-2xl shadow-dark-shadow'>
                <Controller name='photo' control={control} render={({ field }) => {
                    return <ProfilePhotoInput name='profile-photo' onBlur={field.onBlur} onChange={field.onChange} value={field.value} />
                }} />
                <Input {...register("username")} placeholder='Username' inputRef={register("username").ref} />
                <Input {...register("email")} placeholder='E-mail address' inputRef={register("email").ref} />
                <button
                    type="submit"
                    disabled={isPending || !isValid}
                    className={`${styles.btn} text-white text-sm hover:ring-2 focus:ring-2 ring-dark-ring-1 border flex items-center justify-center border-dark-border py-1`}>
                    {isPending ? <Loading /> : 'Sign In'}
                </button>
            </div>
        </form>)
}
