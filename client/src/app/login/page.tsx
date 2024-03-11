'use client';

import { IUser, userAtom } from '@/atoms/userAtom';
import { login } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import Loading from '../components/loading';
import styles from '../styles';
import Input from '../components/input';
import Image from 'next/image';
import GoogleButton from '../components/google-button';

const LoginSchema = z.object({
    email: z.string(),
    password: z.string()
})

export type LoginFormType = z.infer<typeof LoginSchema>;

export default function Page() {
    const router = useRouter();
    const setUser = useSetAtom(userAtom);

    const { register, handleSubmit } = useForm<LoginFormType>({
        resolver: zodResolver(LoginSchema),
    })

    const onSuccess = async (user: IUser) => {
        setUser(user);
        router.push('/problems');
    }

    const { mutate, isPending } = useMutation<IUser, any, LoginFormType>({
        meta: {
            onSuccess
        },
        mutationFn: login
    })

    const submit: SubmitHandler<LoginFormType> = async (data) => {
        mutate(data);
    }

    return (
        <form className="py-8 flex justify-center items-center h-full" onSubmit={handleSubmit(submit)}>
            <div className='bg-dark-border max-w-full w-96 rounded-sm px-3 py-6 flex flex-col gap-y-5 shadow-2xl shadow-dark-shadow'>
                <Image className='h-20 w-20 pb-2 self-center object-contain' src={'/logo.png'} alt='logo' height={1080} width={1080} />
                <Input {...register("email")} placeholder='E-mail address' inputRef={register("email").ref} />
                <Input {...register("password")} placeholder='Password' inputRef={register("password").ref} />
                <button
                    type="submit"
                    disabled={isPending}
                    className={`${styles.btn} text-white text-sm hover:ring-2 focus:ring-2 ring-dark-ring-1 border flex items-center justify-center border-dark-border py-1`}>
                    {isPending ? <Loading /> : 'Log In'}
                </button>
                <GoogleButton />
            </div>
        </form>
    )
}
