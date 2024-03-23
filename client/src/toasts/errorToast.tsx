import toast from "react-hot-toast";

export const errorToast = (message: string) => {
    toast.error(message, {
        position: 'top-center',
        style: {
            background: '#333',
            color: '#fff',
            fontSize: "14px"
        },
        className: 'rounded-2xl',
        duration: 4000
    })
    return;
}
