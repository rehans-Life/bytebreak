import React, { useEffect, useRef } from 'react'

export default function FillerBar({
    tag,
    backgroundColor,
    fillColor,
    value,
    total
}: {
    tag: string,
    backgroundColor: string,
    fillColor: string,
    value: number,
    total: number
}) {
    const fillRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fillWidth = (value * 100) / total;
        if (fillRef.current)
            fillRef.current.style.width = `${fillWidth}%`;
        return;
    }, [value])

    return (
        <div className='flex flex-col gap-y-1 w-full'>
            <div className='flex items-center'>
                <div className="text-dark-gray-7 text-xs w-[84px]">{tag}</div>
                <div className="text-white flex items-center gap-x-1">
                    <span className="text-lg font-semibold">{value}</span>
                    <span className="text-sm font-semibold text-dark-gray-6">/{total}</span>
                </div>
            </div>
            <div className={`${backgroundColor} overflow-hidden w-full h-2 rounded-lg`}>
                <div ref={fillRef} className={`${fillColor} h-full transition-all ease-in duration-150 w-0 rounded-lg`}></div>
            </div>
        </div>
    )
}
