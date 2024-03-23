'use client';

import { getProblems, getTags } from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Table from '../components/table';
import TooltipContainer from '../components/tooltip';
import capitalize from 'capitalize';
import Select, { Option } from '../components/select';
import { difficulties, headers, perPages, statuses } from '@/data/input-data';
import { FaRadiationAlt } from '@react-icons/all-files/fa/FaRadiationAlt';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { Tag } from '../interfaces';
import { convert } from '@/utils/convert';
import usePaginate from '@/hooks/usePaginate';
import Paginator from '../components/paginator';
import FormatNumber from '../components/formatNumber';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { SubProblem } from '../create-problem/interfaces';

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

  return <div className='h-full'>
    <div className='px-4 py-8 h-full w-full text-white flex items-center justify-center flex-col'>
      <div className='w-full max-w-[900px] flex items-center justify-center flex-col gap-y-6'>
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

}
