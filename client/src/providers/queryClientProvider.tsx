'use client'

import React, { useState } from 'react'
import { QueryClientProvider, QueryClient, MutationCache, QueryCache, Query } from '@tanstack/react-query'
import { errorHandler } from '../app/utils/errorHandler'

export default function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(new QueryClient({
    queryCache: new QueryCache({
      onSuccess: (data, query) => {
        if (!query.meta?.onSuccess || typeof query.meta?.onSuccess !== 'function') return;
        query.meta.onSuccess(data)
      }
    }),
    mutationCache: new MutationCache({
      onError: errorHandler,
    })
  }))

  return (
    <QueryClientProvider client={queryClient}>{children}
    </QueryClientProvider>
  )
}
