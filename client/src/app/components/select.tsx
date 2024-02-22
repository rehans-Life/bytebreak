import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { IoChevronDownOutline } from '@react-icons/all-files/io5/IoChevronDownOutline'
import { IoClose } from '@react-icons/all-files/io5/IoClose'
import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark'
import { IoSearch } from '@react-icons/all-files/io5/IoSearch'

export interface Option<T> {
  value: T
  label: string
  color?: string
}

interface Props<VT> {
  children?: React.ReactNode
  name?: string
  placeholder?: string
  enableSearch: boolean
  onFocus?: () => void
  onBlur?: () => void
  menuHeight?: string
  menuWidth?: string
  replaceName?: boolean
  inlineBtnStyle?: string
  btnStyle?: React.CSSProperties
  options: Option<VT>[]
  highlightedOptions?: Option<VT>[]
  highlightTag?: string
}4

interface MultiProps<VT> {
  isMulti: true
  value?: Option<VT>[]
  undefined: true
  onChange?: (options?: Option<VT>[]) => void
}

interface SingleProps<VT> {
  isMulti: false
}

interface NonNullSingle<VT> extends SingleProps<VT> {
  undefined: true
  value?: Option<VT>
  onChange?: (option?: Option<VT>) => void
}

interface NullableSingle<VT> extends SingleProps<VT> {
  undefined: false
  value: Option<VT>
  onChange?: (option: Option<VT>) => void
}

const Option = function <VT>({
  option,
  props,
  isHighlighted,
  highlightedTag = 'Related',
  setShowMenu,
}: {
  option: Option<VT>
  props: NullableSingle<VT> | NonNullSingle<VT> | MultiProps<VT>
  isHighlighted?: boolean
  highlightedTag?: string
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const selected = props.value
    ? props.isMulti
      ? props.value.some(({ value }) => option.value === value)
      : props.value.value === option.value
    : false

  return (
    <div
      style={{
        color: option.color,
      }}
      className={`text-dark-gray-8 py-2 ${selected
        ? `font-medium text-dark-label-1`
        : `font-normal text-dark-label-2`
        }  text-sm rounded-md px-3 hover:bg-dark-button cursor-pointer flex items-center justify-between gap-x-3`}
      onClick={() => {
        if (selected) {
          if (props.isMulti) {
            props.onChange?.(
              props.value?.filter(({ value }) => value !== option.value)
            )
          } else {
            setShowMenu((prev) => !prev)
            if (props.undefined) props.onChange?.()
          }

          return
        }
        if (props.isMulti) {
          if (props.value) props.onChange?.([...props.value, option])
          else props.onChange?.([option])
        } else {
          setShowMenu((prev) => !prev)
          props.onChange?.(option)
        }
      }}
    >
      <div className="flex items-center gap-x-2.5">
        <div
          className="label"
          style={{
            color: option.color ?? 'white',
          }}
        >
          {option.label}
        </div>
        {isHighlighted && (
          <span className="px-1.5 py-1 rounded-md font-normal text-dark-blue-s bg-dark-blue-l">
            {highlightedTag}
          </span>
        )}
      </div>
      {selected && (
        <IoCheckmark className="text-dark-blue-s h-4 w-4" />
      )}
    </div>
  )
}

export default function Select<VT = unknown>({
  children,
  name,
  options,
  value,
  placeholder,
  menuHeight,
  menuWidth,
  enableSearch,
  isMulti,
  replaceName,
  btnStyle,
  undefined,
  inlineBtnStyle,
  onChange,
  onBlur,
  onFocus,
  highlightTag,
  highlightedOptions,
}: (NullableSingle<VT> | NonNullSingle<VT> | MultiProps<VT>) & Props<VT>) {
  const [showMenu, setShowMenu] = useState(false)
  const [query, setQuery] = useState('')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onClick(e: Event) {
      if (
        !(containerRef.current === e.target) &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setShowMenu(false)
      }
      onBlur?.()
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [onBlur])

  return (
    <div ref={containerRef} className="relative">
      <span
        onClick={() => {
          setShowMenu(!showMenu)
          onFocus?.()
        }}
      >
        {children ?? (
          <button
            type="button"
            style={btnStyle}
            className={`${inlineBtnStyle} bg-dark-fill-2 hover:bg-dark-hover text-[15px] text-white px-3 py-1 rounded-md flex items-center justify-between gap-x-1`}
          >
            <div className="capitalize">
              {replaceName && value ? (
                isMulti ? (
                  <div className="flex items-center gap-x-1">
                    {value.map((option, i) => (
                      <span key={i} className="p-1 flex items-center gap-x-1 cursor-pointer rounded-md text-[11px] hover:bg-layer-2 text-white bg-dark-layer-1">
                        <span>{option.label}</span>
                        <IoClose
                          size={16}
                          onClick={(e: Event) => {
                            e.stopPropagation()
                            onChange?.(
                              value?.filter(
                                ({ value }) => value !== option.value
                              )
                            )
                          }}
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <span
                    style={{
                      color: value.color,
                    }}
                  >
                    {value.label}
                  </span>
                )
              ) : (
                name
              )}
            </div>
            <IoChevronDownOutline
              className={`${showMenu ? 'rotate-180' : 'rotate-0'
                } ease-in duration-200`}
            />
          </button>
        )}
      </span>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={bottomMenuRef}
            className={`absolute top-full my-2 overflow-hidden rounded-md z-[9999] shadow-sm shadow-dark-layer-3 bg-dark-layer-3  ${menuWidth || 'w-auto'
              }`}
            initial={{
              opacity: 0,
              y: '3%',
              transitionTimingFunction: 'ease-out',
            }}
            animate={{
              opacity: 1,
              y: 0,
              transitionTimingFunction: 'ease-out',
            }}
            exit={{
              transitionTimingFunction: 'ease-out',
              opacity: 0,
              y: '3%',
            }}
          >
            <div
              className={`overflow-y-auto p-2 flex flex-col gap-y-1 ${menuHeight}`}
            >
              {enableSearch && (
                <>
                  <div className="flex items-center rounded-md py-1.5 px-3 gap-x-2 bg-dark-button">
                    <IoSearch className="text-dark-label-2 w-15" size={15} />
                    <input
                      type="text"
                      value={query}
                      placeholder={placeholder}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-transparent outline-none text-dark-label-2 placeholder:text-dark-label-2 text-sm"
                    />
                  </div>
                </>
              )}
              {options
                .filter((option) =>
                  option.label.toLowerCase().includes(query.toLowerCase())
                )
                .map((option, i) => {
                  return (
                    <Option
                      key={i}
                      option={option}
                      highlightedTag={highlightTag}
                      isHighlighted={highlightedOptions?.some(
                        (tag) => tag.value === option.value
                      )}
                      props={{
                        isMulti,
                        onChange,
                        value,
                        undefined,
                      } as MultiProps<VT> | NonNullSingle<VT> | NullableSingle<VT>
                      }
                      setShowMenu={setShowMenu}
                    />
                  )
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
