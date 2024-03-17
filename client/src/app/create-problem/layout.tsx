export const dynamic = "force-dynamic";

import React, { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackError from '@/app/components/error';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Problem',
    description: 'Contribute a problem to our platform',
}
  
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
