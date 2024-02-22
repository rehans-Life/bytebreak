import { AiOutlineClockCircle } from '@react-icons/all-files/ai/AiOutlineClockCircle';
import { FiCpu } from '@react-icons/all-files/fi/FiCpu';
import React, { useState } from 'react'

function Value({ value }: {
    value: string,
}) {
    return <div className='flex items-center gap-x-1'>
        {value.split(/\s/).map((val, i) => {
            if (i === 0) {
                return <div className='text-md font-semibold'>
                    {val}
                </div>
            } else {
                return <div className={`text-sm text-dark-label-1  `}>
                    {val}
                </div>
            }
        })}
    </div>
}

export default function CodeMetrics({
    runtime, memory
}: { runtime: string, memory: string }) {
    const [selectedMetric, setSelectedMetric] = useState("runtime");

    return (
        <div className='rounded-md border-dark-border border p-3 flex flex-col gap-y-3'>
            <div onClick={() => setSelectedMetric("runtime")} className={`${selectedMetric === "runtime" ? "bg-dark-divider-border-2 opacity-100" : "bg-transparent opacity-40"} py-3 px-4 rounded-md flex flex-col transiion-all ease-in duration-100 gap-y-2 cursor-pointer hover:opacity-100`} >
                <div className="font-medium text-sm flex items-center gap-x-1">
                    <AiOutlineClockCircle />
                    Runtime
                </div>
                <Value
                    value={runtime}
                />
            </div>
            <div onClick={() => setSelectedMetric("memory")} className={`${selectedMetric === "memory" ? "bg-dark-divider-border-2 opacity-100" : "bg-transparent opacity-40"} py-3 px-4 rounded-md flex flex-col transiion-all ease-in duration-100 gap-y-2 cursor-pointer hover:opacity-100`} >
                <div className="font-medium text-sm flex items-center gap-x-1">
                    <FiCpu />
                    Memory
                </div>
                <Value
                    value={memory}
                />
            </div>
        </div>
    )
}
