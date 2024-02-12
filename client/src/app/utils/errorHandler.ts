import { AxiosError } from "axios"
import { ToastOptions, toast } from "react-hot-toast"
import { ApiErrorResponse } from "../interfaces"

export const errorHandler = ((error: Error, _: any, { errorMsg }: { onClose?: () => any, errorMsg?: string } & any) => {
    const toastOptions: ToastOptions = {
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
      },
    }

  
    if(error instanceof AxiosError) {
      if (error.response) {
        console.log(error.response)
        toast.error((error.response.data as ApiErrorResponse).message,
        toastOptions
        );
      } else if (error.request) {
        console.log(error.request)
        toast.error(errorMsg || 'Something went terribly wrong 💥', toastOptions)
      } else {
        console.log(error.message)
        toast.error(error.message, toastOptions)
      }
    }
  })