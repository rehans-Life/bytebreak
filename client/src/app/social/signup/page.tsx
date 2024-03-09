'use client';

import Input from '@/app/components/input';
import Loading from '@/app/components/loading';
import styles from '@/app/styles';
import { IGoogleUser, IUser, googleUserAtom, userAtom } from '@/atoms/userAtom';
import { createGoogleUser } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

const SignInSchema = z.object({
    email: z.string(),
    username: z.string()
})

export type SignInFormType = z.infer<typeof SignInSchema>;

export default function Page() {
    const router = useRouter();
    const user = useAtomValue(googleUserAtom);
    const setUser = useSetAtom(userAtom);

    const { register, handleSubmit } = useForm<SignInFormType>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: user?.username,
            email: user?.email
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

    const submit: SubmitHandler<SignInFormType> = ({ email, username }) => {
        mutate({
            email,
            username,
            photo: user?.photo || "",
            userId: user?.userId || ""
        });
    }

    return (
        <form className="py-8 flex justify-center items-center h-full" onSubmit={handleSubmit(submit)}>
            <div className='bg-dark-border max-w-full w-96 rounded-sm px-3 py-6 flex flex-col gap-y-5 shadow-2xl shadow-dark-shadow'>
                <Image className='h-20 w-20 pb-2 self-center object-contain' src={'/logo.png'} alt='logo' height={1080} width={1080} />
                <Input {...register("username")} placeholder='Username' inputRef={register("username").ref} />
                <Input {...register("email")} placeholder='E-mail address' inputRef={register("email").ref} />
                <button
                    type="submit"
                    disabled={isPending}
                    className={`${styles.btn} text-white text-sm hover:ring-2 focus:ring-2 ring-dark-ring-1 border flex items-center justify-center border-dark-border py-1`}>
                    {isPending ? <Loading /> : 'Sign In'}
                </button>
            </div>
        </form>)
}
