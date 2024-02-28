'use client';

import { getProblems, getTags } from '@/utils/api';
import { keepPreviousData, useQueries } from '@tanstack/react-query';
import React, { useState } from 'react'
import { SubProblem } from '../create-problem/interfaces';
import { useRouter } from 'next/navigation'
import Table, { Header } from '../components/table';
import TooltipContainer from '../components/tooltip';
import capitalize from 'capitalize';
import Select, { Option } from '../components/select';
import { difficulties } from '../create-problem/page';
import { FaRadiationAlt } from '@react-icons/all-files/fa/FaRadiationAlt';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { Tag } from '../interfaces';
import { convert } from '@/utils/convert';
import usePaginate from '@/hooks/usePaginate';

const headers: Header[] = [
  {
    label: "Status",
    name: "status",
    width: 60
  },
  {
    label: "Name",
    name: "name",
    width: 250
  },
  {
    label: "Accceptance",
    name: "accceptanceRate",
    width: 100
  },
  {
    label: "Difficulty",
    name: "name",
    width: 100
  },
]

const perPages: Option<number>[] = [
  {
    label: "2 / page",
    value: 2
  },
  {
    label: "5 / page",
    value: 5
  },
  {
    label: "10 / page",
    value: 10
  }
]

const statuses: Option<string>[] = [
  {
    label: "Solved",
    value: "solved"
  },
  {
    label: "Attempted",
    value: "attempted"
  },
  {
    label: "Todo",
    value: "todo"
  }
]

export default function Problems() {
  const {
    searchParams,
    nextPage,
    previousPage,
    setField,
    setPerPageLimit,
    deleteField
  } = usePaginate();

  const router = useRouter();

  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "5";
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status");
  const tag = searchParams.getAll("tag");
  const name = searchParams.get("name");

  const [tags, setTags] = useState<Option<number>[]>([]);
  const [problems, setProblems] = useState<SubProblem[]>([]);

  const [{ }, { }] = useQueries({
    queries: [
      {
        meta: {
          onSuccess: function (data: SubProblem[]) {
            setProblems(data)
          }
        },
        queryKey: ['problems', page, perPage, difficulty, status, name, tag],
        queryFn: getProblems,
        placeholderData: keepPreviousData
      },
      {
        meta: {
          onSuccess: function (data: Tag[]) {
            setTags(convert<number>(data, 'name', '_id'));
          }
        },
        queryKey: ['tags', 'topic'],
        queryFn: getTags
      }
    ]
  });

  return <div className='p-4 w-full text-white flex items-center justify-center flex-col'>
    <div className='w-full max-w-[900px] flex items-center justify-center flex-col gap-y-4'>
      <div className='text-2xl font-medium'>Problems</div>
      <div className='sm:grid flex flex-col sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full sm:gap-2 gap-y-3'>
        <Select
          isMulti={false}
          undefined={false}
          enableSearch={false}
          onChange={({ value }) => setPerPageLimit(value)}
          value={perPages.find(({ value }) => value === (Number(searchParams.get("perPage")) || 5))!}
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
            onInput={(event) => {
              console.log((event.target as HTMLInputElement).value)
              setField("name", (event.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>
      <Table
        headers={headers}
        rows={problems}
        render={function (row) {
          return <tr key={row._id} className='text-sm h-11'>
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
                  {capitalize.words(row.name)}
                </div>
              </TooltipContainer>
            </td>
            <td>{((row.accepted / (row.submissions || 1)) * 100).toFixed(1)}%</td>
            <td className={`${row.difficulty === 'hard' && 'text-dark-red'} ${row.difficulty === 'easy' && 'text-dark-green-s'} capitalize ${row.difficulty === 'medium' && 'text-dark-yellow'}`}>{row.difficulty}</td>
            <td className='w-full'></td>
          </tr>
        }}
      />
      <div
        className='flex items-center'
        onClick={nextPage}
      >Next Page</div>
      <div className='text-lg'>{page}</div>
      <div
        className='flex items-center'
        onClick={previousPage}
      >Previous Page</div>
    </div>
  </div>

}
