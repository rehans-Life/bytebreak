import React from 'react'
import { UploadCloud } from 'lucide-react'
import { BsFileEarmarkCheck } from '@react-icons/all-files/bs/BsFileEarmarkCheck'
import { ControllerRenderProps } from 'react-hook-form'

export default function FileInput({
  value,
  accept,
  onChange,
  ...props
}: ControllerRenderProps & { accept: string }) {
  return (
    <label
      htmlFor="file-input"
      className="h-52 relative flex items-center justify-center cursor-pointer rounded-md border-dark-gray-8 border-dotted border-2"
    >
      {value && (
        <div className="flex relative flex-col gap-y-4 items-center">
          <BsFileEarmarkCheck size={70} className="text-dark-label-2" />
          <span className="text-white font-medium">{value?.name}</span>
        </div>
      )}
      {!value && (
        <div className="flex flex-col items-center gap-y-1">
          <UploadCloud className="text-dark-label-2 animate-pulse" size={50} />
          <div className="text-dark-label-2 font-medium">
            Upload a file from your device
          </div>
        </div>
      )}
      <input
        id="file-input"
        className="appearance-none hidden"
        type="file"
        multiple={false}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0])}
        {...props}
      />
    </label>
  )
}
