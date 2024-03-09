import { v4 as uuid } from 'uuid'
import React, { useState } from 'react'
import { RefCallBack, UseFormRegisterReturn } from 'react-hook-form'

export default function Input({
  label,
  inputRef,
  inputStyles,
  labelStyles,
  placeholder,
  ...props
}: UseFormRegisterReturn<any> & {
  label?: string
  labelStyles?: string
  inputStyles?: string
  placeholder?: string
  inputRef: RefCallBack
  ref: RefCallBack
}) {
  const [uid] = useState(uuid())
  return (
    <div className="flex flex-col gap-y-1.5">
      {label && <label
        htmlFor={uid}
        className={`${labelStyles} text-white text-sm sm:text-normal font-medium`}
      >
        {label}
      </label>}
      <input
        id={uid}
        ref={inputRef}
        className={`${inputStyles} placeholder:text-dark-label-2 placeholder:text-sm bg-transparent border-dark-label-1 border focus:border-dark-layer-2 text-white rounded-md px-2 py-1.5 focus:ring-2 focus:ring-dark-ring-1`}
        onChange={props.onChange}
        onBlur={props.onBlur}
        name={props.name}
        placeholder={placeholder}
      />
    </div>
  )
}
