import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { IoChevronDownOutline } from '@react-icons/all-files/io5/IoChevronDownOutline'
import { atom, useAtom, useSetAtom } from 'jotai'
import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark'

export interface Header<Value = any, Field = any> {
    label: string,
    name: string,
    width: number,
    options?: HeaderOption<Value>[],
    compareFunc?: (selectedValue: Value, fieldValue: Field) => boolean
}

export interface HeaderOption<VType = any> {
    value: VType
    label: string
}

const filtersAtom = atom<{ [key: string]: any }>({});
const dropdownsAtom = atom<{ [key: string]: boolean }>({});

function TableOption({ label, name, value }: { label: string, name: string, value: any }) {
    const [filters, setFilters] = useAtom(filtersAtom);

    return <div className={`py-2 ${filters[name] === value
        ? `font-medium text-white`
        : `font-normal text-dark-label-2`
        }  text-sm rounded-md px-3 hover:bg-dark-button cursor-pointer flex items-center justify-between gap-x-3`} onClick={() => {
            if (filters[name] === value) return;
            setFilters({ ...filters, [name]: value })
        }}
    >
        {label}
        {
            filters[name] === value && (
                <IoCheckmark className="text-dark-blue-s h-4 w-4" />
            )
        }
    </div>
}

function TableSelect({ label, name, options, showDropdown }: { label: string, name: string, options: HeaderOption[], showDropdown: boolean }) {
    return <div className='flex items-center gap-x-1.5 cursor-pointer hover:text-white transition-all duration-150 ease-in'>
        {label}
        <IoChevronDownOutline className={`${showDropdown ? 'rotate-180' : 'rotate-0'
            } ease-in duration-200`} />
        {showDropdown &&
            <div className='absolute top-full my-2 overflow-y-auto max-h-52 w-52 rounded-md z-[9999] shadow-sm shadow-dark-layer-3 bg-dark-layer-3'>
                <TableOption label={label} value={null} name={name} />
                {options.map(({ label, value }, i) => <TableOption key={i} label={label} value={value} name={name} />)}
            </div>
        }
    </div>
}

function TableHeader({ label, name, options, width }: Header) {
    const [dropdowns, setDropdowns] = useAtom(dropdownsAtom);

    return <td style={{
        minWidth: `${width}px`
    }} onClick={() => {
        if (!dropdowns[name]) {
            for (const header in dropdowns) {
                if (dropdowns.hasOwnProperty(header)) {
                    dropdowns[header] = false;
                }
            }
        }
        setDropdowns({
            ...dropdowns,
            [name]: !dropdowns[name]
        })
    }
    } className='text-sm text-dark-label-2 relative py-2'>
        {
            options ?
                <TableSelect label={label} name={name} options={options} showDropdown={dropdowns[name]} />
                : label
        }
    </td>
}

export default function Table<T, V = any, F = any>({
    headers, rows, render, className, emptyMsg
}: { emptyMsg?: string, className?: string, headers: Header<V, F>[], rows: T[], render: (row: T, index?: number) => ReactElement<HTMLTableRowElement> }) {
    const headerRef = useRef<HTMLTableRowElement | null>(null);

    const [filters, setFilters] = useAtom(filtersAtom);
    const setDropdowns = useSetAtom(dropdownsAtom);

    const filteredRows = useMemo(() => {
        const filterEntries = Object.entries(filters);
        return rows.filter((row) => {

            function helper(i = 0): boolean {
                if (i === filterEntries.length) return true;

                const [field, value] = filterEntries[i];
                const header = headers.find(({ name }) => name === field);

                if (value) {
                    if ((header?.compareFunc && !header.compareFunc(value, row[field as keyof T] as F))) {
                        return false;
                    }
                    if (!header?.compareFunc && row[field as keyof T] !== value) return false
                }

                return helper(i + 1);
            }

            return helper();
        })
    }, [filters, rows])

    useEffect(() => {
        if (!headers) return;

        setFilters(headers.reduce<{ [key: string]: any }>((acc, curr) => {
            acc[curr.name] = null;
            return acc;
        }, {}));

        setDropdowns(headers.reduce((acc, { name, options }) => {
            if (!options) return acc;
            return Object.assign(acc, {
                [name]: false
            })
        }, {}))

    }, [headers]);

    useEffect(() => {
        function onClick(event: Event) {
            if (event.target !== headerRef.current && !headerRef.current?.contains(event.target as Node)) {
                setDropdowns(headers.reduce((acc, { name, options }) => {
                    if (!options) return acc;
                    return Object.assign(acc, {
                        [name]: false
                    })
                }, {}))
            }
        }

        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick);
        }
    }, [headers]);

    return (
        <div className='w-full h-full overflow-y-auto'>
            <table className={`${className}`}>
                <thead>
                    <tr ref={headerRef} className='w-full border-b border-dark-border'>
                        {
                            headers.map((header, index) => <TableHeader key={index} {...header} />)
                        }
                        <td className='w-full'></td>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.length ?
                        <>
                            {filteredRows.map((row, index) => render(row, index))}
                            <tr className='!bg-transparent h-full'>
                                <div></div>
                            </tr>
                        </>
                        :
                        <tr className='!bg-transparent'>
                            <td colSpan={100}>
                                <div className='w-full flex flex-col items-center gap-y-4'>
                                    <img src="/null.png" alt="null" className='w-44 h-44' />
                                    <span className='font-medium text-dark-gray-6'>{emptyMsg || "No Data"}</span>
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}
