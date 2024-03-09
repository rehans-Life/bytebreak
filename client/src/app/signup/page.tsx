'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import Input from '../components/input';
import styles from '../styles';
import { useMutation } from '@tanstack/react-query';
import Loading from '../components/loading';
import { signup } from '@/utils/api';
import ProfilePhotoInput from '../components/profile-photo-input';
import { IUser, userAtom } from '@/atoms/userAtom';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import GoogleButton from '../components/google-button';

const SignUpFormSchema = z.object({
    photo: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
})

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;

export default function Page() {
    const router = useRouter();
    const setUser = useSetAtom(userAtom);

    const { control, register, handleSubmit } = useForm<SignUpFormType>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            photo: "https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/avatars%2Fdefault.jpg?alt=media&token=0aa62cc6-2260-4ce6-a595-4ae5f809dad3"
        }
    })

    const { mutate, isPending } = useMutation<IUser, any, SignUpFormType>({
        meta: {
            onSuccess: async (user: IUser) => {
                setUser(user);
                router.push('/problems');
            }
        },
        mutationFn: signup
    })

    const submit: SubmitHandler<SignUpFormType> = async (data) => {
        mutate(data);
    }

    return (
        <form className="py-8 flex justify-center items-center h-full" onSubmit={handleSubmit(submit)}>
            <div className='bg-dark-border max-w-full w-96 rounded-sm px-3 py-6 flex flex-col gap-y-5 shadow-2xl shadow-dark-shadow'>
                <Controller
                    name="photo"
                    control={control}
                    render={({ field }) => {
                        return <ProfilePhotoInput {...field} />
                    }}
                />
                <Input {...register("username")} placeholder='Username' inputRef={register("username").ref} />
                <Input {...register("email")} placeholder='E-mail address' inputRef={register("email").ref} />
                <Input {...register("password")} placeholder='Password' inputRef={register("password").ref} />
                <Input {...register("confirmPassword")} placeholder='Confirm Password' inputRef={register("confirmPassword").ref} />
                <button
                    type="submit"
                    disabled={isPending}
                    className={`${styles.btn} text-white text-sm hover:ring-2 focus:ring-2 ring-dark-ring-1 border flex items-center justify-center border-dark-border py-1`}>
                    {isPending ? <Loading /> : 'Sign Up'}
                </button>
                <div className='text-center text-dark-label-2'>or</div>
                <GoogleButton />
            </div>
        </form>
    )
}
