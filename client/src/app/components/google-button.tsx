import React from 'react'
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import styles from '../styles';
import { IUser, googleUserAtom } from '@/atoms/userAtom';
import { getGoogleUser } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { errorToast } from '@/toasts/errorToast';
import { AxiosError } from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { userAtom } from '@/atoms/userAtom';
import defaultPhoto from '@/utils/defaultPhoto';

export default function GoogleButton() {
    const router = useRouter();
    const setUser = useSetAtom(userAtom);
    const setGoogleUser = useSetAtom(googleUserAtom);

    const getUser = useMutation({
        onMutate() {
            return {
                skipErrorHandling: true
            }
        },
        meta: {
            onSuccess: (user: IUser) => {
                setUser(user);
                router.push("/problems");
            }
        },
        mutationFn: getGoogleUser
    })

    const { mutate, isPending } = useMutation({
        onMutate() {
            return {
                errorMsg: "An Error Occured while performing google auth please try again"
            }
        },
        mutationFn: async () => {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(auth, provider);

            try {
                await getUser.mutateAsync(cred.user.uid);
            } catch (error) {
                const errorMsg = 'An Occured while performing google auth please try again later';

                if (error instanceof AxiosError && error.response && error.response.status === 404) {
                    setGoogleUser({
                        email: cred.user.email || "",
                        userId: cred.user.uid,
                        username: cred.user.displayName || "",
                        photo: cred.user.photoURL || defaultPhoto,
                    })
                    router.push('/social/signup')
                    return;
                }

                errorToast(errorMsg);
            }
        }
    });


    return (
        <button
            type='button'
            disabled={isPending || getUser.isPending}
            onClick={() => mutate()}
            className={`${styles.btn}  text-white text-sm hover:ring-2 focus:ring-2 ring-dark-ring-1 disabled:!ring-0 border flex items-center gap-x-2 border-dark-border !px-3 !py-2.5`}
        >
            <FcGoogle className="text-lg" />
            Google Sign In with Google
        </button>
    )
}
