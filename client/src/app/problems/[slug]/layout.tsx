import React, { ReactNode, Suspense } from 'react'
import Problem from './Problem';
import { ErrorBoundary } from 'react-error-boundary'
import FallbackError from '@/app/components/error';

export default async function Layout({
    children,
    params: { slug }
}: {
    children: ReactNode,
    params: {
        slug: string
    }
}) {
    return (
        <ErrorBoundary FallbackComponent={FallbackError}>
            <Suspense fallback={<div className='bg-dark-layer-1 h-screen'></div>}>
                <div className='bg-dark-fill-1 text-white h-screen'>
                    <header className='text-white'>{slug}</header>
                    <Problem slug={slug}>
                        {children}
                    </Problem>
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}
