'use client';

import React, { useCallback, useEffect } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import Select from '@/app/components/select';
import { convert } from '@/app/utils/convert';
import { TagWithConfig } from '@/app/interfaces';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { codeAtom, languageAtom, selectLanguageAtom } from '../../../../atoms/languagesAtoms';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { IoMdRewind } from "@react-icons/all-files/io/IoMdRewind";
import { useMutation } from '@tanstack/react-query';
import { runCode, submitCode } from '@/app/utils/api';
import { Problem } from '@/app/create-problem/interfaces';

export default function CodeEditor({
    languages,
    problem,
}: { languages: TagWithConfig[], problem: Problem }) {

    const [codes, setCodes] = useAtom(codeAtom)

    const lang = useAtomValue(languageAtom)
    const setLang = useSetAtom(selectLanguageAtom);

    const run = useMutation({
        mutationFn: runCode,
        onSuccess(data) {
            console.log(data)
        },
        throwOnError: false
    })

    const submit = useMutation({
        mutationFn: submitCode,
        onSuccess(data) {
            console.log(data)
        },
        throwOnError: false
    })

    const onRun = async () => {
        const languageId = languages.find(({ slug }) => slug === lang?.value)?._id!;
        run.mutate({
            code: codes[lang?.value || ""] || "",
            languageId,
            problemId: problem._id,
            testcases: problem.sampleTestCases.map(({ input, output }) => ({ input, output })),

        })
    }

    const onSubmit = async () => {
        const languageId = languages.find(({ slug }) => slug === lang?.value)?._id!;
        submit.mutate({
            code: codes[lang?.value || ""] || "",
            languageId,
            problemId: problem._id
        })
    }

    const getLanguageConfig = useCallback(
        (slug: string) => {
            return languages.find((lang) => lang.slug === slug)
        },
        [languages],
    )


    useEffect(() => {
        setLang(languages[0]);
    }, []);

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
            <button onClick={onRun}>Run</button>
            <button onClick={onSubmit}>Submit</button>
        </div>
    )
}
