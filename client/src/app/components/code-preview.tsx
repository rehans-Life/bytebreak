import React from 'react'
import { Tag } from '../interfaces'
import VertDivider from "./vert-divider";
import Highlight from 'react-highlight'
import 'highlight.js/styles/vs2015.css'

export default function CodePreview({
    language,
    code
}: {
    language?: Tag,
    code: string
}) {
    return (
        <div className="flex gap-y-2 flex-col w-full justify-start">
            <div className='flex gap-x-3 items-center text-sm font-medium text-dark-gray-6'>Code <VertDivider /> {language?.name}</div>
            <Highlight className={`${language?.slug || "auto"} rounded-lg`}>
                {code}
            </Highlight>
        </div>
    )
}
