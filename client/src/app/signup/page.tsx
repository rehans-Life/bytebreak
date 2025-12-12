'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useMemo } from 'react'
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
import Link from 'next/link';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiLock } from '@react-icons/all-files/fi/FiLock';
import { FiEye } from '@react-icons/all-files/fi/FiEye';
import { FiEyeOff } from '@react-icons/all-files/fi/FiEyeOff';
import { FiUser } from '@react-icons/all-files/fi/FiUser';

const SignUpFormSchema = z.object({
    photo: z.string(),
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const strength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    if (!password) return null;

    return (
        <div className='mt-1'>
            <div className='flex gap-x-1 mb-1'>
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                            level <= strength ? strengthColors[strength - 1] : 'bg-dark-fill-2'
                        }`}
                    />
                ))}
            </div>
            <span className='text-xs text-dark-label-2'>{strengthLabels[strength - 1] || 'Very Weak'}</span>
        </div>
    );
};

export default function Page() {
    const router = useRouter();
    const setUser = useSetAtom(userAtom);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormType>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            photo: "https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/avatars%2Fdefault.jpg?alt=media&token=0aa62cc6-2260-4ce6-a595-4ae5f809dad3"
        }
    })

    const password = watch('password');

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
        <div className="py-8 flex justify-center items-center h-full px-4">
            <div className='bg-dark-layer-1 border border-dark-border max-w-full w-full sm:w-96 rounded-lg px-6 py-8 flex flex-col gap-y-6 shadow-2xl shadow-dark-shadow'>
                <div className='flex flex-col items-center gap-y-2'>
                    <h1 className='text-2xl font-semibold text-white'>Create an account</h1>
                    <p className='text-sm text-dark-label-2'>Join ByteBreak and start solving problems</p>
                </div>

                <form onSubmit={handleSubmit(submit)} className='flex flex-col gap-y-4'>
                    <Controller
                        name="photo"
                        control={control}
                        render={({ field }) => {
                            return <ProfilePhotoInput {...field} />
                        }}
                    />

                    <div className='flex flex-col gap-y-1'>
                        <div className='relative'>
                            <FiUser className='absolute left-3 top-1/2 -translate-y-1/2 text-dark-label-2 text-lg' />
                            <Input 
                                {...register("username")} 
                                placeholder='Username' 
                                inputRef={register("username").ref}
                                inputStyles='pl-10'
                            />
                        </div>
                        {errors.username && (
                            <span className='text-xs text-red-500 mt-1'>{errors.username.message}</span>
                        )}
                    </div>

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
                        <PasswordStrengthIndicator password={password || ''} />
                        {errors.password && (
                            <span className='text-xs text-red-500 mt-1'>{errors.password.message}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-y-1'>
                        <div className='relative'>
                            <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-dark-label-2 text-lg' />
                            <Input 
                                {...register("confirmPassword")} 
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Confirm Password' 
                                inputRef={register("confirmPassword").ref}
                                inputStyles='pl-10 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark-label-2 hover:text-white transition-colors'
                            >
                                {showConfirmPassword ? <FiEyeOff className='text-lg' /> : <FiEye className='text-lg' />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className='text-xs text-red-500 mt-1'>{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`${styles.btn} bg-dark-blue-s hover:bg-dark-blue-s/90 text-white text-sm font-medium hover:ring-2 focus:ring-2 ring-dark-ring-1 border-0 flex items-center justify-center py-2.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                        {isPending ? <Loading /> : 'Create Account'}
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
                    Already have an account?{' '}
                    <Link href='/login' className='text-dark-blue-s hover:text-dark-blue-s/80 font-medium transition-colors'>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
