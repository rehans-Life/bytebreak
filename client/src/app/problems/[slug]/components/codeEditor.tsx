'use client';

import React, { useCallback } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import Select from '@/app/components/select';
import { convert } from '@/utils/convert';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { codeAtom, languageAtom, languagesAtom, selectLanguageAtom } from '@/atoms/languagesAtoms';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { IoMdRewind } from "@react-icons/all-files/io/IoMdRewind";

export default function CodeEditor() {

    const [codes, setCodes] = useAtom(codeAtom)

    const lang = useAtomValue(languageAtom)
    const languages = useAtomValue(languagesAtom)
    const setLang = useSetAtom(selectLanguageAtom);

    const getLanguageConfig = useCallback(
        (slug: string) => {
            return languages.find((lang) => lang.slug === slug)
        },
        [languages],
    )

    return (
        <div>
            <div className="flex justify-between rounded-tl-md p-2 bg-dark-divider-border-2 rounded-tr-md">
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
                        inlineBtnStyle="w-32 p-1 text-sm"
                    />
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger onClick={
                            () => {
                                setCodes({
                                    ...codes,
                                    [lang!.value]: getLanguageConfig(lang?.value!)!.defaultConfiguration
                                })
                            }
                        }><IoMdRewind /></TooltipTrigger>
                        <TooltipContent>
                            <p className='text-xs'>Reset to default code defination</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <MonacoEditor
                theme='vs-dark'
                value={codes[lang?.value!]}
                onChange={(val) => setCodes({ ...codes, [lang!.value]: val || "" })}
                className='h-64'
                language={lang?.value}
            />
        </div>
    )
}
