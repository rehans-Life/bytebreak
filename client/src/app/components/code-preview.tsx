import React from 'react'
import { Tag } from '../interfaces'
import VertDivider from "./vert-divider";
import 'highlight.js/styles/vs2015.css'
import useShowMore from '@/hooks/useShowMore';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function CodePreview({
    language,
    code
}: {
    language?: Tag,
    code: string
}) {
    const [showMore, setShowMore, containerRef] = useShowMore();

    return (
        <div className="flex gap-y-2 flex-col w-full justify-start">
            <div className='flex gap-x-3 items-center !text-sm font-medium text-dark-gray-6'>Code <VertDivider /> {language?.name}</div>
            <div ref={containerRef} className='bg-code-background rounded-lg px-4 py-2'>
                <SyntaxHighlighter
                    language={language?.slug || "auto"}
                    style={vs2015}
                    customStyle={{
                        overflowY: "hidden",
                        overflowX: "auto",
                        maxHeight: showMore ? "" : "160px",
                        fontSize: "14px",
                        lineHeight: "20px"
                    }}
                >
                    {code.trim()}
                </SyntaxHighlighter>
                <div
                    onClick={() => setShowMore(prev => !prev)}
                    id='more'
                    className='cursor-pointer text-sm text-dark-label-2 gap-x-1 z-99 flex items-center justify-center w-full'>
                    {showMore ? <ChevronsUp className='h-5 w-5' /> : <ChevronsDown className='h-5 w-5' />} View More
                </div>
            </div>
        </div>
    )
}
