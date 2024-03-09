import Select, { Option } from '@/app/components/select';
import { getUserCalender } from '@/utils/api';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { UserCalender } from '../interfaces';
import formatDate from '@/utils/formatDate';
import HeatMapSkeleton from '@/skeletons/heatmap-skeleton';

export default function SubmissionsHeatmap() {
    const params = useParams();
    const [year, setYear] = useState<Option<number>>({
        value: new Date().getFullYear(),
        label: 'current'
    });

    const [cal, setCal] = useState<any>(undefined);

    const { data, isFetching } = useQuery<UserCalender>({
        queryKey: ['user-calender', params.username, year.value],
        queryFn: getUserCalender,
        placeholderData: keepPreviousData,
        throwOnError: true
    });

    const options = useMemo(() => {
        const today = new Date();
        const endToday = (() => {
            const today = new Date();
            today.setDate(today.getDate() - 335);

            return today;
        })();

        const submissionsCalender = data?.submissionsCalender || []
        let least = Infinity;
        let highest = -Infinity;

        if (submissionsCalender.length) {
            for (let i = 0; i < submissionsCalender.length; i++) {
                least = Math.min(least, submissionsCalender[i].submissions);
                highest = Math.max(highest, submissionsCalender[i].submissions);
            }
        } else {
            least = 0;
            highest = 0;
        }

        return ({
            theme: 'dark',
            data: {
                source: data?.submissionsCalender,
                type: 'json',
                x: 'date',
                y: (d: any) => +d['submissions'],
            },
            itemSelector: '#cal-heatmap-index',
            date: {
                start: year.value === today.getFullYear() ? endToday : new Date(`${year?.value || today.getFullYear()}-01-01`),
            },
            domain: {
                type: 'month',
                gutter: 10,
                radius: 2
            },
            scale: {
                color: {
                    type: 'linear',
                    range: ['#14432a', '#166b34', '#37a446', '#4dd05a'],
                    domain: [least, highest],
                },
            },
            subDomain: {
                type: 'day',
                gutter: 4,
                radius: 2
            }
        })
    }, [data?.submissionsCalender, year]);

    const years = useMemo<Option<number>[]>(() => {
        const today = new Date();
        return data?.activeYears.map((year) => {
            return {
                value: year,
                label: year === today.getFullYear() ? 'Currrent' : year.toString()
            }
        }) || []
    }, [data?.activeYears]);

    async function initCalHeatMap() {
        const CalHeatMapConstructor = (await import('cal-heatmap')).default;
        const calHeatMap = new (CalHeatMapConstructor as ObjectConstructor)();
        setCal(calHeatMap);
    }

    const paint = useMutation({
        mutationFn: async () => {
            const toolTip = (await import('../../../../node_modules/cal-heatmap/src/plugins/Tooltip')).default;

            cal?.paint(options, [
                [toolTip, {
                    text: function (date: string, value: number) {
                        return (
                            `${value || 0} submissions on ${formatDate(date, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}`
                        );
                    },
                },
                ]
            ]);
        }
    })

    useEffect(() => {
        (async () => initCalHeatMap())()
    }, []);

    useEffect(() => {
        if (!cal) return;
        (async () => await paint.mutateAsync())()
    }, [cal, options]);

    return (<div className='p-5 rounded-lg bg-dark-layer-1 flex flex-col gap-y-2'>
        <div className='flex sm:items-center justify-between items-start flex-col sm:flex-row gap-y-3'>
            <div className='text-md text-dark-gray-7'><span className='text-xl font-bold text-white'>{data?.submissionsCalender.reduce((acc, day) => acc + day.submissions, 0) || 0}</span> submissions in the last year
            </div>
            <Select
                isMulti={false}
                enableSearch={false}
                options={years}
                undefined={false}
                disabled={isFetching}
                replaceName={true}
                name='current'
                onChange={(option) => {
                    setYear(option)
                }}
                value={year}
                menuWidth='w-full'
                optionStyle="!text-xs"
                inlineBtnStyle='!text-xs w-32 !gap-x-2 !py-1.5 !text-dark-label-2'
            />
        </div>
        <div className='pt-3'></div>
        <div id="cal-heatmap-index"></div>
        <div className='heat-map-skeleton'><HeatMapSkeleton /></div>
    </div>
    )
}
