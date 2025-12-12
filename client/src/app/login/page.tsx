'use client';

import { IUser, userAtom } from '@/atoms/userAtom';
import { login } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import Loading from '../components/loading';
import styles from '../styles';
import Input from '../components/input';
import Image from 'next/image';
import GoogleButton from '../components/google-button';
import Link from 'next/link';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiLock } from '@react-icons/all-files/fi/FiLock';
import { FiEye } from '@react-icons/all-files/fi/FiEye';
import { FiEyeOff } from '@react-icons/all-files/fi/FiEyeOff';

const LoginSchema = z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required')
})

export type LoginFormType = z.infer<typeof LoginSchema>;

export default function Page() {
    const router = useRouter();
    const setUser = useSetAtom(userAtom);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({
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
        <div className="py-8 flex justify-center items-center h-full px-4">
            <div className='bg-dark-layer-1 border border-dark-border max-w-full w-full sm:w-96 rounded-lg px-6 py-8 flex flex-col gap-y-6 shadow-2xl shadow-dark-shadow'>
                <div className='flex flex-col items-center gap-y-2'>
                    <Image className='h-16 w-16 object-contain' src={'/logo.png'} alt='logo' height={1080} width={1080} />
                    <h1 className='text-2xl font-semibold text-white'>Welcome back</h1>
                    <p className='text-sm text-dark-label-2'>Sign in to continue to ByteBreak</p>
                </div>

                <form onSubmit={handleSubmit(submit)} className='flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-1'>
                        <div className='relative'>
                            <FiMail className='absolute left-3 top-1/2 -translate-y-1/2 text-dark-label-2 text-lg' />
                            <Input 
                                {...register("email")} 
                                placeholder='Email address' 
                                inputRef={register("email").ref}
                                inputStyles='pl-10'
                            />
                        </div>
                        {errors.email && (
                            <span className='text-xs text-red-500 mt-1'>{errors.email.message}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-y-1'>
                        <div className='relative'>
                            <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-dark-label-2 text-lg' />
                            <Input 
                                {...register("password")} 
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password' 
                                inputRef={register("password").ref}
                                inputStyles='pl-10 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark-label-2 hover:text-white transition-colors'
                            >
                                {showPassword ? <FiEyeOff className='text-lg' /> : <FiEye className='text-lg' />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className='text-xs text-red-500 mt-1'>{errors.password.message}</span>
                        )}
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                        <label className='flex items-center gap-x-2 text-dark-label-2 cursor-pointer'>
                            <input type='checkbox' className='rounded border-dark-border' />
                            <span>Remember me</span>
                        </label>
                        <Link href='#' className='text-dark-blue-s hover:text-dark-blue-s/80 transition-colors'>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`${styles.btn} bg-dark-blue-s hover:bg-dark-blue-s/90 text-white text-sm font-medium hover:ring-2 focus:ring-2 ring-dark-ring-1 border-0 flex items-center justify-center py-2.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                        {isPending ? <Loading /> : 'Sign In'}
                    </button>
                </form>

                <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-dark-border'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='px-2 bg-dark-layer-1 text-dark-label-2'>Or continue with</span>
                    </div>
                </div>

                <GoogleButton />

                <div className='text-center text-sm text-dark-label-2'>
                    Don't have an account?{' '}
                    <Link href='/signup' className='text-dark-blue-s hover:text-dark-blue-s/80 font-medium transition-colors'>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
