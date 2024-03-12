'use client'

import React, { useState } from 'react'
import { QueryClientProvider, QueryClient, MutationCache, QueryCache } from '@tanstack/react-query'
import { errorHandler } from '../utils/errorHandler'

export default function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!query.meta?.onError || typeof query.meta?.onError !== 'function') return;
        query.meta.onError(error)
      },
      onSuccess: (data, query) => {
        if (!query.meta?.onSuccess || typeof query.meta?.onSuccess !== 'function') return;
        query.meta.onSuccess(data)
      }
    }),
    mutationCache: new MutationCache({
      onError: errorHandler,
      onSuccess: (data, _, __, { meta }) => {
        if (!meta?.onSuccess || typeof meta?.onSuccess !== 'function') return;
        meta.onSuccess(data)
      }
    })
  })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
