'use client';

import Link from 'next/link'
import React, { ReactNode } from 'react'

export function Section({
    children
}: { children: ReactNode }) {
    return (
        <div>
            <div className="flex flex-col border-dark-gray-6 border rounded-md overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export function SectionTab({
    children,
    active,
    href,
}: { href: string, children: ReactNode, active?: boolean }) {
    return <Link href={href} className={`section-tab flex relative items-center gap-x-2 cursor-pointer font-medium text-white text-sm px-2 py-1 ${active ? "opacity-1" : "opacity-65"} hover:bg-dark-fill-2 rounded-sm`}>
        <div className='absolute h-[55%] w-[0.01rem] bg-dark-fill-3 right-0 rounded-full'></div>
        {children}
    </Link>
}

export function SectionHeader({
    children
}: { children: ReactNode }) {
    return <div className="section-header sticky divide-dark-border top-0  flex-wrap gap-y-2 flex items-center p-1 bg-dark-layer-3">
        {children}
    </div>
}

export function SectionBody({
    children
}: { children: ReactNode }) {
    return <div className="bg-dark-layer-1">
        {children}
    </div>
}

export function SectionFooter({
    children
}: { children: ReactNode }) {
    return <div className="sticky bottom-0 bg-dark-layer-1 p-1 flex items-center">
        {children}
    </div>
}