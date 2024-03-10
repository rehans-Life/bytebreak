import Select from '@/app/components/select'
import React, { useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ProblemType } from '../interfaces'
import { langs } from 'lang-code-configuration/data'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { languagesAtom } from '../../../atoms/tagAtoms'
import { convert } from '@/utils/convert'
import RestrictedEditor from '@/app/components/restricted-editor'
import generateCodeConfig from '@/utils/generateCodeConfig'
import TooltipContainer from '@/app/components/tooltip'
import { CgFormatLeft } from "@react-icons/all-files/cg/CgFormatLeft";
import { editor } from 'monaco-editor'
import { RiArrowGoBackLine } from "@react-icons/all-files/ri/RiArrowGoBackLine";
import { codesAtom, langAtom, setLangAtom } from '@/atoms/codeEditorAtoms'
import usePrevious from '@/hooks/usePrevious'

export default function Editor() {
  const { control, setValue, getValues } = useFormContext<ProblemType>();

  const config = useWatch({
    control,
    name: 'config',
  })

  const prevConfig = usePrevious(config)

  const lang = useAtomValue(langAtom)
  const langs = useAtomValue(languagesAtom)

  const setLang = useSetAtom(setLangAtom)
  const [codes, setCodes] = useAtom(codesAtom)

  const editorRef = useRef<editor.IStandaloneCodeEditor>()

  useEffect(() => {
    if (!lang) return;
    setValue(
      'solution',
      {
        languageId: langs.find(({ slug }) => lang!.value === slug)!._id,
        code: codes[lang.value]?.code || ""
      }
    )
  }, [lang])

  useEffect(() => {
    if (lang) return;

    if (!langs.length) return;
    const firstLang = langs[0];

    setLang({
      value: firstLang.slug,
      label: firstLang.name
    }, config)

  }, [langs])

  useEffect(() => {
    if (!prevConfig) return;

    let LangConfig = codes[lang?.value || ""];

    if (!LangConfig) return;

    let { code, restrictedLines } = LangConfig;

    const newCode = generateCodeConfig((lang?.value || "") as langs, config);

    code = code.replace(
      new RegExp(/.*\(.*?\).*/),
      newCode.match(".*" + config.funcName + "\\(.*?\\).*")?.[0] || ""
    )

    setCodes({
      ...codes,
      [lang!.value]: { code, restrictedLines },
    })

  }, [config, getValues('solution.languageId')]);

  useEffect(() => {
    if (!Object.entries(codes)) return;

    const code = codes[lang?.value || ""]?.code

    if (!code) return;

    setValue('solution.code', code)

  }, [codes])

  return (
    <>
      <div className="rounded-tl-md flex justify-between items-center py-2 px-3 bg-code-background border-b border-dark-border rounded-tr-md">
        <Select
          isMulti={false}
          enableSearch={false}
          name="Language"
          menuWidth="w-[200px]"
          menuHeight="h-[150px]"
          inlineBtnStyle="w-32"
          options={convert<langs>(langs, 'name', 'slug')}
          value={lang!}
          onChange={(o) => {
            setLang(o, config)
          }}
          undefined={false}
          replaceName={true}
        ></Select>
        <div className='flex items-center gap-x-3'>
          <TooltipContainer
            onClick={() => {
              editorRef.current?.trigger('format code', 'editor.action.formatDocument', {})
            }}
            message='Format Code'
          >
            <CgFormatLeft className='text-white' size={18} />
          </TooltipContainer>
          <TooltipContainer
            onClick={() => {
              if (!lang) return;

              let { restrictedLines } = codes[lang.value];

              setCodes({
                ...codes,
                [lang.value]: {
                  restrictedLines,
                  code: generateCodeConfig(lang.value as langs, config)
                }
              })
            }}
            message='Reset to default code defination'
          >
            <RiArrowGoBackLine className='text-white' size={18} />
          </TooltipContainer>
        </div>
      </div>
      <RestrictedEditor
        language={lang?.value}
        value={codes[lang?.value || ""]?.code}
        onChange={(code) => {
          const currConfig = codes[lang!.value]

          setCodes({
            ...codes,
            [lang!.value]: { ...currConfig, code: code || "" }
          })
        }}
        onMount={(editor) => {
          editorRef.current = editor
        }}
        className="md:h-full h-64 relative md:absolute"
        restrictedLines={codes[lang?.value || ""]?.restrictedLines || []}
        options={{
          formatOnPaste: false,
          automaticLayout: true,
          minimap: {
            enabled: false
          },
          padding: {
            top: 15,
          },
        }}
      />
    </>
  )
}
