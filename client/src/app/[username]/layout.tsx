import React, { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackError from '../components/error'

export default function layout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div>
            <ErrorBoundary fallback={<FallbackError />} >
                {children}
            </ErrorBoundary>
        </div>
    )
}
