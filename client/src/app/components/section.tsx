'use client';

import React, { ReactNode } from 'react'

export function Section({
    className,
    children
}: { children: ReactNode, className?: string }) {
    return (
        <div className='border-dark-gray-6 h-full border rounded-md overflow-hidden'>
            <div className={`${className} h-full flex flex-col bg-dark-layer-1`}>
                {children}
            </div>
        </div>
    )
}

export function SectionTab({
    children,
    active = true,
    onClick,
}: { onClick?: () => void, children: ReactNode, active?: boolean }) {
    return <div onClick={onClick} className={`section-tab flex text-nowrap relative items-center gap-x-2 cursor-pointer text-white text-sm px-2 py-1 ${active ? "opacity-1 font-medium" : "opacity-65"} hover:bg-dark-fill-2 rounded-sm`}>
        <div className='absolute h-[55%] w-[0.01rem] bg-dark-fill-3 right-0 rounded-full'></div>
        {children}
    </div>
}

export function SectionHeader({
    children
}: { children: ReactNode }) {
    return <div className="section-header w-full left-0 right-0 z-50 sticky divide-dark-border top-0 gap-y-2 flex items-center p-1 bg-dark-layer-3">
        {children}
    </div>
}

export function SectionBody({
    children
}: { children: ReactNode }) {
    return children
}

export function SectionFooter({
    children
}: { children: ReactNode }) {
    return <div className="sticky bottom-0 left-0 right-0 z-49 bg-dark-layer-1 empty:!p-0 p-1 flex items-center">
        {children}
    </div>
}