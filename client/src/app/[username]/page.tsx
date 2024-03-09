'use client';

import React from 'react'
import 'cal-heatmap/cal-heatmap.css';
import SubmissionsHeatmap from './components/submissions-heatmap';
import SolvedProblems from './components/solved-problems';
import UserInfo from './components/user-info';
import Contributions from './components/contributions';

export default function Page() {
    return (<div className='p-5 grid md:grid-cols-[300px_1fr] grid-cols-1 w-full gap-3'>
        <div>
            <UserInfo />
        </div>
        <div className='flex flex-col overflow-hidden gap-y-3'>
            <SolvedProblems />
            <SubmissionsHeatmap />
            <Contributions />
        </div>
    </div>
    )
}
