'use client';

import { getProblemInsights, getProblems, getTags } from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Table from '../components/table';
import TooltipContainer from '../components/tooltip';
import capitalize from 'capitalize';
import Select, { Option } from '../components/select';
import { difficulties, headers, perPages, statuses } from '@/data/input-data';
import { FaRadiationAlt } from '@react-icons/all-files/fa/FaRadiationAlt';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { ProblemInsights, Tag } from '../interfaces';
import { convert } from '@/utils/convert';
import usePaginate from '@/hooks/usePaginate';
import Paginator from '../components/paginator';
import FormatNumber from '../components/formatNumber';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { SubProblem } from '../create-problem/interfaces';
import {
  Bar,
  Line,
} from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip as ChartTooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  ChartTooltip,
);

const SectionCard: React.FC<
  React.PropsWithChildren<{ title: string; description?: string }>
> = ({ title, description, children }) => (
  <div className="rounded-lg border border-dark-border bg-dark-layer-1 p-4 shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="text-sm text-dark-label-2 uppercase tracking-wide">
          {title}
        </div>
        {description && (
          <div className="text-xs text-dark-gray-6">{description}</div>
        )}
      </div>
    </div>
    {children}
  </div>
);

const StatCard = ({
  label,
  value,
  accent,
  helper,
  loading,
}: {
  label: string
  value: string | number
  helper?: string
  accent?: string
  loading?: boolean
}) => (
  <div className="rounded-md border border-dark-border bg-dark-layer-2 p-3 flex flex-col gap-1">
    <div className="text-xs uppercase tracking-wide text-dark-label-2">
      {label}
    </div>
    {loading ? (
      <Skeleton className="h-6 w-24 bg-dark-fill-2" />
    ) : (
      <div className="text-xl font-semibold" style={{ color: accent }}>
        {value}
      </div>
    )}
    {helper && (
      <div className="text-[11px] text-dark-gray-6">{helper}</div>
    )}
  </div>
)

const TopList = ({
  title,
  items,
  loading,
}: {
  title: string
  loading: boolean
  items: React.ReactNode
}) => (
  <SectionCard title={title}>
    {loading ? (
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full bg-dark-fill-2" />
        ))}
      </div>
    ) : (
      items
    )}
  </SectionCard>
)

const RowSkeleton = () => {
  return <tr className='text-sm h-11' >
    <td>
      <Skeleton className="h-5 w-5 rounded-full bg-dark-fill-2" />
    </td>
    <td>
      <Skeleton className="h-4 w-[80%] rounded-md bg-dark-fill-2" />
    </td>
    <td>
      <Skeleton className="h-4 w-[50%] rounded-md bg-dark-fill-2" />
    </td>
    <td>
      <Skeleton className="h-4 w-[50%] rounded-md bg-dark-fill-2" />
    </td>
    <td>
      <Skeleton className="h-5 w-5 rounded-full bg-dark-fill-2" />
    </td>
    <td className='w-full'></td>
  </tr>
}

export default function Problems() {
  const {
    searchParams,
    nextPage,
    previousPage,
    setField,
    setPerPageLimit,
    setPage,
    deleteField
  } = usePaginate();

  const router = useRouter();
  const user = useAtomValue(userAtom)

  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "5";
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status");
  const tag = searchParams.getAll("tag");
  const name = searchParams.get("name");

  const [tags, setTags] = useState<Option<number>[]>([]);

  const { data, isLoading, isFetched } = useQuery({
    meta: {
      onSuccess: ({ maxPage }: { problems: SubProblem[], maxPage: number }) => {
        if (parseInt(page) > maxPage) {
          setPage(maxPage)
        }
      }
    },
    queryKey: ['problems', page, perPage, difficulty, status, name, tag],
    queryFn: getProblems,
    placeholderData: keepPreviousData
  })

  const { } = useQuery({
    meta: {
      onSuccess: function (data: Tag[]) {
        setTags(convert<number>(data, 'name', '_id'));
      }
    },
    queryKey: ['tags', 'topic'],
    queryFn: getTags
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<ProblemInsights>({
    queryKey: ['problem-insights'],
    queryFn: getProblemInsights,
    staleTime: 1000 * 60 * 2,
  })

  const performanceBarData = useMemo(() => {
    const performance = insights?.performanceByDifficulty ?? []
    return {
      labels: performance.map((p) => capitalize(p.difficulty)),
      datasets: [
        {
          label: 'Avg Acceptance %',
          data: performance.map((p) => p.avgAcceptance),
          backgroundColor: performance.map((p) =>
            p.difficulty === 'easy'
              ? '#22c55e'
              : p.difficulty === 'medium'
                ? '#eab308'
                : '#f87171'
          ),
          borderRadius: 8,
        },
        {
          label: 'Avg Likes',
          data: performance.map((p) => p.avgLikes),
          backgroundColor: 'rgba(148, 163, 184, 0.35)',
          borderRadius: 8,
          yAxisID: 'y1',
        },
      ],
    }
  }, [insights])

  const performanceOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e5e7eb' } },
        tooltip: { mode: 'index' as const, intersect: false },
      },
      scales: {
        y: {
          type: 'linear' as const,
          beginAtZero: true,
          ticks: { color: '#e5e7eb' },
          grid: { color: 'rgba(75,85,99,0.25)' },
          title: { display: true, text: 'Acceptance %', color: '#9ca3af' },
        },
        y1: {
          type: 'linear' as const,
          beginAtZero: true,
          position: 'right' as const,
          ticks: { color: '#e5e7eb' },
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Likes', color: '#9ca3af' },
        },
        x: {
          type: 'category' as const,
          ticks: { color: '#e5e7eb' },
          grid: { display: false },
        },
      },
    }),
    []
  )

  const monthlyLineData = useMemo(() => {
    const points = insights?.monthlyAcceptance ?? []
    return {
      labels: points.map((p) => p.month),
      datasets: [
        {
          label: 'Avg Acceptance %',
          data: points.map((p) => p.avgAcceptance),
          fill: true,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.15)',
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    }
  }, [insights])

  const monthlyOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e5e7eb' } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#e5e7eb' },
          grid: { color: 'rgba(75,85,99,0.25)' },
          title: { display: true, text: 'Acceptance %', color: '#9ca3af' },
        },
        x: {
          ticks: { color: '#e5e7eb' },
          grid: { display: false },
        },
      },
    }),
    []
  )

  const maxTagCount = useMemo(() => {
    const counts = insights?.topTags?.map((t) => t.totalProblems) || []
    return counts.length ? Math.max(...counts) : 1
  }, [insights])

  return (
    <div className='h-full'>
      <div className='px-4 py-8 h-full w-full text-white'>
        <div className='w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6'>
        {/* Insights Panel - Left Side */}
        <div className='lg:w-[42%] xl:w-[38%] flex-shrink-0 flex flex-col gap-y-6 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-2'>
          <SectionCard
            title="Problem insights"
            description="Quick health check of the catalog to guide your practice."
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Total"
                value={insights?.totals.total ?? 0}
                helper="All published problems"
                accent="#38bdf8"
                loading={insightsLoading}
              />
              <StatCard
                label="Easy"
                value={insights?.totals.easy ?? 0}
                helper="Friendly warm-ups"
                accent="#22c55e"
                loading={insightsLoading}
              />
              <StatCard
                label="Medium"
                value={insights?.totals.medium ?? 0}
                helper="Good practice"
                accent="#eab308"
                loading={insightsLoading}
              />
              <StatCard
                label="Hard"
                value={insights?.totals.hard ?? 0}
                helper="Time to sweat"
                accent="#f87171"
                loading={insightsLoading}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <SectionCard
                title="Difficulty performance"
                description="Acceptance vs. likes by difficulty."
              >
                <div className="h-56">
                  {insightsLoading ? (
                    <Skeleton className="h-full w-full bg-dark-fill-2" />
                  ) : (insights?.performanceByDifficulty?.length ?? 0) > 0 ? (
                    <Bar data={performanceBarData} options={performanceOptions} />
                  ) : (
                    <div className="text-sm text-dark-label-2 h-full flex items-center justify-center">
                      Not enough data yet.
                    </div>
                  )}
                </div>
              </SectionCard>
              <SectionCard
                title="Recent acceptance trend"
                description="Average acceptance by month."
              >
                <div className="h-56">
                  {insightsLoading ? (
                    <Skeleton className="h-full w-full bg-dark-fill-2" />
                  ) : (insights?.monthlyAcceptance?.length ?? 0) > 0 ? (
                    <Line data={monthlyLineData} options={monthlyOptions} />
                  ) : (
                    <div className="text-sm text-dark-label-2 h-full flex items-center justify-center">
                      Not enough data yet.
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <TopList
                title="Top tags by coverage"
                loading={insightsLoading}
                items={
                  <div className="flex flex-col gap-3">
                    {(insights?.topTags || []).map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between gap-3 border border-dark-border rounded-md p-3 bg-dark-layer-2"
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{tag.name}</div>
                          <div className="text-xs text-dark-label-2">
                            {tag.totalProblems} problems · {tag.avgAcceptance}% avg acceptance
                          </div>
                        </div>
                        <div className="w-32 h-2 rounded-full bg-dark-fill-2 overflow-hidden">
                          <div
                            className="h-full bg-dark-blue-s"
                            style={{
                              width: `${(tag.totalProblems / maxTagCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {(insights?.topTags?.length ?? 0) === 0 && (
                      <div className="text-sm text-dark-label-2">
                        No tag data to show yet.
                      </div>
                    )}
                  </div>
                }
              />
              <TopList
                title="Most liked"
                loading={insightsLoading}
                items={
                  <div className="flex flex-col gap-3">
                    {(insights?.topProblems || []).map((problem) => (
                      <div
                        key={problem._id}
                        className="flex items-center justify-between gap-3 border border-dark-border rounded-md p-3 bg-dark-layer-2"
                      >
                        <div className="flex flex-col">
                          <div
                            className="font-medium hover:text-dark-blue-s cursor-pointer"
                            onClick={() => router.push(`/problems/${problem.slug}`)}
                          >
                            {problem.name}
                          </div>
                          <div className="text-xs text-dark-label-2 capitalize">
                            {problem.difficulty} · {problem.acceptanceRate}% acceptance
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-dark-yellow">
                          <FormatNumber num={problem.likes} /> ❤️
                        </div>
                      </div>
                    ))}
                    {(insights?.topProblems?.length ?? 0) === 0 && (
                      <div className="text-sm text-dark-label-2">
                        No liked problems to highlight yet.
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* Problems List - Right Side */}
        <div className='lg:w-[58%] xl:w-[62%] flex flex-col gap-y-6'>
          <div className='sm:grid flex flex-col sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full sm:gap-2 gap-y-3'>
            <Select
              isMulti={false}
              undefined={false}
              enableSearch={false}
              onChange={({ value }) => setPerPageLimit(value)}
              value={perPages.find(({ value }) => value === Number(perPage))!}
              replaceName
              options={perPages}
              name='Limit'
              menuWidth="w-full"
              menuHeight="max-h-auto"
              inlineBtnStyle='w-full py-1.5 rounded-md !text-dark-label-2'
            />
            <Select
              inlineBtnStyle='w-full py-1.5 rounded-md !text-dark-label-2'
              enableSearch={false}
              isMulti={false}
              options={difficulties}
              menuWidth="w-full"
              menuHeight="max-h-auto"
              replaceName={true}
              undefined={true}
              name={"Difficulty"}
              btnStyle={{
                minWidth: '110px',
              }}
              value={difficulties.find(({ value }) => value === difficulty)}
              onChange={(option) =>
                option ? setField("difficulty", option.value) : deleteField("difficulty")
              }
            />
            <Select
              enableSearch={false}
              isMulti={false}
              options={statuses}
              disabled={!user}
              menuWidth="w-full"
              menuHeight="max-h-auto"
              inlineBtnStyle='w-full py-1.5 rounded-md !text-dark-label-2'
              placeholder="Filter topics"
              replaceName={true}
              undefined={true}
              name={"Status"}
              btnStyle={{
                minWidth: '110px',
              }}
              value={statuses.find(({ value }) => value === status)}
              onChange={(option) => option ? setField("status", option?.value) : deleteField("status")}
            />
            <Select
              enableSearch={true}
              isMulti={true}
              inlineBtnStyle='w-full py-1.5 rounded-md !text-dark-label-2'
              options={tags}
              undefined={true}
              menuWidth="w-full lg:min-w-[225px] min-w-auto"
              menuHeight="max-h-56"
              name="Topics"
              placeholder='Search Topics'
              value={tag.map((tagId) => tags.find(({ value }) => value == Number(tagId))!)}
              onChange={(options) => {
                options ? setField("tag", options.map(({ value }) => value.toString())) : deleteField("tag")
              }}
            />
            <div className='flex items-center gap-x-3 overflow-hidden lg:col-span-1 col-span-2 bg-dark-fill-2 text-dark-label-2 rounded-md px-3 py-2'>
              <FiSearch className="text-dark-gray-6" />
              <input
                type="text"
                placeholder='Search Questions'
                className='placeholder:text-dark-gray-6 placeholder:font-medium bg-transparent outline-0 border-0 text-sm w-full'
                onBlur={(event) => {
                  const value = (event.target as HTMLInputElement).value
                  if (!value) { deleteField("name"); return; }
                  setField("name", value);
                }}
              />
            </div>
          </div>
          <Table
            headers={headers}
            className={` ${!isFetched ? "opacity-50" : "opacity-100"} `}
            rows={isLoading ? new Array(Number(perPage)).fill(0) : (data?.problems || [])}
            render={function (row, index) {

              if (!row) {
                return <RowSkeleton key={index} />
              }

              return <tr key={row._id} className={`text-sm h-11`}>
                <td>
                  {row.status === 'solved' &&
                    <FiCheckCircle className="text-dark-green-s text-md" />
                  }
                  {row.status === 'attempted' &&
                    <FaRadiationAlt className="text-dark-yellow text-md" />
                  }
                </td>
                <td>
                  <TooltipContainer
                    side='bottom'
                    message={row.name}
                    onClick={() => router.push(`/problems/${row.slug}`)}
                  >
                    <div className="hover:text-dark-blue-s text-nowrap">
                      {row.name}
                    </div>
                  </TooltipContainer>
                </td>
                <td className="font-medium">{((row.accepted / (row.submissions || 1)) * 100).toFixed(1)}%</td>
                <td className={`${row.difficulty === 'hard' && 'text-dark-red'} ${row.difficulty === 'easy' && 'text-dark-green-s'} capitalize ${row.difficulty === 'medium' && 'text-dark-yellow'}`}>{row.difficulty}</td>
                <td className='font-medium'><FormatNumber num={row.likes || 0} /></td>
                <td className='w-full'></td>
              </tr>
            }}
          />
          <Paginator
            setPage={setPage}
            nextPage={nextPage}
            previousPage={previousPage}
            activePage={Number(page)}
            maxPage={data?.maxPage || Number(page)}
          />
        </div>
      </div>
    </div>
  </div>
  )
}
