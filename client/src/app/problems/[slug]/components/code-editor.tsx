'use client';

import React, { useCallback, useRef } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import Select from '@/app/components/select';
import { convert } from '@/utils/convert';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { codeAtom, languageAtom, languagesAtom, selectLanguageAtom } from '@/atoms/languagesAtoms';
import TooltipContainer from '@/app/components/tooltip';
import { RiArrowGoBackLine } from "@react-icons/all-files/ri/RiArrowGoBackLine";
import { CgFormatLeft } from "@react-icons/all-files/cg/CgFormatLeft";
import { editor } from 'monaco-editor'
import { Section, SectionBody, SectionFooter, SectionHeader, SectionTab } from '@/app/components/section';
import { IoCodeSlash } from "@react-icons/all-files/io5/IoCodeSlash";
import { fontSizeAtom, tabSpaceAtom } from '@/atoms/problemAtoms';

export default function CodeEditor() {
    const editorRef = useRef<editor.IStandaloneCodeEditor>()

    const [codes, setCodes] = useAtom(codeAtom)

    const lang = useAtomValue(languageAtom)
    const languages = useAtomValue(languagesAtom)
    const fontSize = useAtomValue(fontSizeAtom)
    const tabSpace = useAtomValue(tabSpaceAtom)

    const setLang = useSetAtom(selectLanguageAtom);

    const getLanguageConfig = useCallback(
        (slug: string) => {
            return languages.find((lang) => lang.slug === slug)
        },
        [languages],
    )

    return (
        <Section>
            <SectionHeader>
                <SectionTab>
                    <IoCodeSlash className="text-dark-green-hover text-lg" />
                    Code
                </SectionTab>
            </SectionHeader>
            <SectionBody className='overflow-x-auto overflow-y-hidden'>
                <div
                    className='min-w-96 h-full'
                >
                    <div className="flex justify-between p-1 bg-code-background border-dark-border border-b">
                        <div>
                            <Select
                                enableSearch={false}
                                isMulti={false}
                                options={convert<string>(languages, 'name', 'slug')}
                                onChange={(newLang) => setLang(getLanguageConfig(newLang.value)!)}
                                value={lang!}
                                name={'Language'}
                                replaceName={true}
                                undefined={false}
                                menuWidth="w-[200px]"
                                menuHeight="h-[150px]"
                                inlineBtnStyle="w-32 p-1 text-sm !bg-transparent hover:!bg-dark-border transition-all ease-out duration-50"
                            />
                        </div>
                        <div className='flex items-center gap-x-1'>
                            <TooltipContainer
                                onClick={() => {
                                    editorRef.current?.trigger('format code', 'editor.action.formatDocument', {})

                                }} message='Format Code'>
                                <div className='hover:bg-dark-border transition-all ease-out duration-50 p-2 rounded-md text-sm'>
                                    <CgFormatLeft />
                                </div>
                            </TooltipContainer>
                            <TooltipContainer
                                onClick={() => {
                                    setCodes({
                                        ...codes,
                                        [lang!.value]: getLanguageConfig(lang?.value!)!.defaultConfiguration
                                    })
                                }}

                                message='Reset to default code defination'>
                                <div className='hover:bg-dark-border transition-all ease-out duration-50 p-2 rounded-md text-sm'>
                                    <RiArrowGoBackLine />
                                </div>
                            </TooltipContainer>

                        </div>

                    </div>
                    <MonacoEditor
                        theme='vs-dark'
                        value={codes[lang?.value!]}
                        onChange={(val) => setCodes({ ...codes, [lang!.value]: val || "" })}
                        language={lang?.value}
                        onMount={(editor) => {
                            editorRef.current = editor
                        }}
                        className="sm:h-full h-60"
                        options={{
                            fontSize: fontSize.value,
                            tabSize: tabSpace.value,
                            minimap: {
                                enabled: false
                            }
                        }} />
                </div>
            </SectionBody>
            <SectionFooter>
                <div className='flex p-1 text-dark-gray-7 text-xs text-right items-center justify-end'>
                    <div>
                        Ln {editorRef.current?.getPosition()?.lineNumber || 0}, Col {editorRef.current?.getPosition()?.column || 0}
                    </div>
                </div>
            </SectionFooter>
        </Section>
    )
}
