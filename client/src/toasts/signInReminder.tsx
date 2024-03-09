import toast from "react-hot-toast";
import { InfoIcon } from 'lucide-react';

export const showSignInToast = (message: string) => {
    toast(message, {
        position: 'top-center',
        style: {
            background: '#333',
            color: '#fff',
            fontSize: "14px"
        },
        className: 'rounded-2xl',
        icon: <InfoIcon className='text-dark-blue-s h-5 w-5' />,
        duration: 2000
    })
    return;
}
