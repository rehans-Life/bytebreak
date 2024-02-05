import React from 'react'

export default function Page({
  params: { slug },
}: {
  params: { slug: string }
}) {
  return <div>{slug}</div>
}
