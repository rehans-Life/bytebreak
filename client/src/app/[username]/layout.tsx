import React, { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackError from '../components/error'

export async function generateMetadata({
    params: { username }
}: { params: { username: string } }) {
    return {
        title: `${username} Profile`,
        description: `Proffile of ${username}`
    }
}   

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
