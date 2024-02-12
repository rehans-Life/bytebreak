import React, { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackError from '@/app/components/error';

export default async function Layout({
    children,
}: {
    children: ReactNode,
}) {
    return (
        <ErrorBoundary FallbackComponent={FallbackError}>
            <Suspense fallback={<div className='bg-dark-layer-1 h-screen'></div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}
