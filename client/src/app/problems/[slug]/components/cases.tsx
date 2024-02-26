import { IoIosClose } from '@react-icons/all-files/io/IoIosClose'
import React, { ReactNode } from 'react'

export default function Cases({
  length, onClick, onClose, selectedCase, prefix
}: {
  length: number,
  selectedCase: number,
  prefix?: (index: number) => ReactNode,
  onClick: (index: number) => void,
  onClose?: (index: number) => void
}) {
  return (
    Array(length).fill(0).map((_, i) =>
      <div
        key={i}
        onClick={() => onClick(i)}
        className={`group py-[6px] flex items-center justify-center gap-x-2 px-4 rounded-lg ${selectedCase === i ? 'bg-dark-fill-3' : 'bg-transparent'} hover:bg-dark-fill-2 cursor-pointer font-medium relative text-sm`}
      >
        {prefix && prefix(i)}
        Case {i + 1}
        {
          length !== 1 && onClose &&
          <div
            onClick={(e) => { e.stopPropagation(); onClose(i) }}
            className='hidden group-hover:flex items-center justify-center -top-1 -right-1 absolute h-3.5 w-3.5 rounded-full text-sm bg-dark-fill-3 hover:bg-dark-layer-3'>
            <IoIosClose />
          </div>
        }
      </div>
    ))
}
