import React from 'react'
import { IoIosArrowBack } from '@react-icons/all-files/io/IoIosArrowBack'
import { IoIosArrowForward } from '@react-icons/all-files/io/IoIosArrowForward'
import { IoEllipsisHorizontal } from '@react-icons/all-files/io5/IoEllipsisHorizontal'

const styles = {
    navigatorStyles: 'w-10 h-9 disabled:bg-dark-layer-1 disabled:text-dark-fill-2 text-lg text-dark-label-1 rounded-md flex items-center justify-center bg-dark-button hover:bg-dark-hover',
    elipsisStyles: 'w-9 h-9 disabled:bg-dark-layer-1 disabled:text-dark-fill-2 text-lg text-dark-label-1 rounded-md flex items-center justify-center bg-dark-button hover:bg-dark-hover',
    pageStyles: 'w-9 h-9 disabled:bg-dark-ring-1 disabled:text-white text-dark-label-1 rounded-md flex items-center justify-center bg-dark-button hover:bg-dark-hover'
}

export default function Paginator({
    activePage, maxPage, setPage, nextPage, previousPage
}: {
    activePage: number,
    maxPage: number,
    setPage: (page: number) => void,
    nextPage: () => void,
    previousPage: () => void,
}) {

    const start = Math.max(1, activePage > (maxPage - 2) ? maxPage - 4 : activePage - 1);
    const end = Math.min(maxPage, activePage < 3 ? 5 : activePage + 1);
    const length = (end - start) + 1;

    return (
        <div className='w-full flex items-center flex-col gap-y-2'>
            <div className="flex items-center gap-x-2">
                <button
                    type="button"
                    onClick={(e) => { previousPage(); }}
                    disabled={activePage === 1}
                    className={`${styles.navigatorStyles} sm:flex hidden`}
                >
                    <IoIosArrowBack />
                </button>
                {start !== 1 && <>
                    <button
                        onClick={(e) => { e.preventDefault(); setPage(1); }}
                        key={1}
                        type='button'
                        disabled={activePage === 1}
                        className={styles.pageStyles}
                    >{1}</button>
                    <button
                        type="button"
                        disabled={true}
                        className={styles.elipsisStyles}
                    >
                        <IoEllipsisHorizontal />
                    </button>
                </>}
                {
                    Array.from(new Array(length < 0 ? 0 : length), (_, i) => i + start).map((currPage) => {
                        return <button
                            onClick={(e) => { e.preventDefault(); setPage(currPage) }}
                            key={currPage}
                            type='button'
                            disabled={activePage === currPage}
                            className={styles.pageStyles}
                        >{currPage}</button>
                    })
                }
                {end !== maxPage && <>
                    <button
                        type="button"
                        disabled={true}
                        className={styles.elipsisStyles}
                    > <IoEllipsisHorizontal />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); setPage(maxPage); }}
                        key={maxPage}
                        type='button'
                        disabled={activePage === maxPage}
                        className={styles.pageStyles}
                    >{maxPage}</button>
                </>}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); nextPage(); }}
                    disabled={activePage === maxPage}
                    className={`${styles.navigatorStyles} sm:flex hidden`}
                >
                    <IoIosArrowForward />
                </button>
            </div>
            <div className='sm:hidden flex items-center w-full justify-center gap-x-2'>
                <button
                    type="button"
                    onClick={(e) => { previousPage(); }}
                    disabled={activePage === 1}
                    className={styles.navigatorStyles}
                >
                    <IoIosArrowBack />
                </button>
                <button
                    type="button"
                    onClick={(e) => { nextPage(); }}
                    disabled={activePage === maxPage}
                    className={styles.navigatorStyles}
                >
                    <IoIosArrowForward />
                </button>
            </div>
        </div>
    )
}
