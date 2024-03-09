import { AxiosError } from "axios"
import { ToastOptions, toast } from "react-hot-toast"
import { ApiErrorResponse } from "../app/interfaces"

export const toastOptions: ToastOptions = {
  position: 'top-center',
  style: {
    background: '#333',
    color: '#fff',
  },
}

export const errorHandler = ((error: Error, _: any, context: any) => {
    let errorMsg = '';

    if (context) {
      if (context?.skipErrorHandling) {
        return;
      }

      if (context?.errorMsg) {
        errorMsg = context.errorMsg;  
      }
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
    } else {
      console.log(error.message)
      toast.error(error.message, toastOptions)
    }
  })