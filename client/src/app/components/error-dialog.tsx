import React from 'react'
import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
import CodeError from './code-error'

export default function ErrorDialog({
    open, onOpenChange, status, message

}: { open: boolean, onOpenChange: (open: boolean) => void, status: string, message: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='bg-dark-layer-2 border-0 text-white max-h-[350px] overflow-x-auto'>
            <div className='text-xl text-dark-red font-semibold'>{status}</div>
            <CodeError errorMsg={message} />
        </DialogContent>
    </Dialog>
  )
}
