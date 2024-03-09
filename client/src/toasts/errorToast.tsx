import toast from "react-hot-toast";
import { XCircle } from 'lucide-react';

export const errorToast = (message: string) => {
    toast.error(message, {
        position: 'top-center',
        style: {
            background: '#333',
            color: '#fff',
            fontSize: "14px"
        },
        className: 'rounded-2xl',
        // icon: <XCircle className='text-dark-red h-5 w-5' />,
        duration: 2000
    })
    return;
}
