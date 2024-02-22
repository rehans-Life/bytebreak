import React, { MouseEventHandler, ReactNode } from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function TooltipContainer({
    children,
    message,
    onClick
}: {
    children: ReactNode,
    message: string,
    onClick?: MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger type='button' className='p-0' onClick={onClick}>
                    {children}
                </TooltipTrigger>
                <TooltipContent className='bg-dark-layer-3 border-dark-border px-2 py-1.5'>
                    <p className='text-xs text-white'>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>)
}
