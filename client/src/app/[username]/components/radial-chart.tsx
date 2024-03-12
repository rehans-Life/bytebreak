import React from 'react'
import dynamic from 'next/dynamic';
import { ChartData } from 'chart.js';

const Doughnut = dynamic(
    () => import("react-chartjs-2").then(async (mod) => {
        await import('chart.js/auto')
        return mod.Doughnut
    }),
    { ssr: false, 
      loading() {
        return <div className='w-[110px] h-[110px] rounded-full'></div>
    }, }
  );
  

export default function RadialChart({
    solved,
    total
}: {
    solved: number
    total: number
}) {
    const solvedPer = Math.round((solved / total) * 360);
    const totalPer = Math.round(((total - solved) / total) * 360);
    const [num, dec] = ((solved * 100) / total).toString().split(".");

    const data: ChartData<"doughnut", number[], string> = {
        labels: [],
        datasets: [{
            data: [solvedPer, totalPer],
            backgroundColor: [
                'rgb(255 161 22)',
                'rgb(60, 60, 60)'
            ],
            borderRadius: 20,
            hoverOffset: 4,
            weight: 2,
            borderWidth: 0,
            hoverBorderWidth: 0,
            hoverBorderDashOffset: 0,
            hoverBorderDash: () => [],
        }]
    };

    return (
        <div className='w-[110px] h-[110px] relative'>
            <div className='absolute top-0 bottom-0 flex items-center justify-center left-0 right-0'>
                <div className='flex group flex-col items-center text-xs text-dark-label-2'>
                    <span className='group-hover:hidden text-xl font-bold text-white'>{solved}</span>
                    <span className='group-hover:inline hidden text-xl font-bold text-white'>{num}
                        <span className='text-xs font-medium'>{dec && `.${dec.substring(0, 2)}`}%</span>
                    </span>
                    Solved
                </div>
            </div>
            <Doughnut
                options={{
                    radius: '100%',
                    responsive: true,
                    cutout: 46,
                    events: [],
                }}
                data={data}
            />
        </div>
    )
}
