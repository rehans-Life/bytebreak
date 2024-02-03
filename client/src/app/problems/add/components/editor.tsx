import Select, { Option } from '@/app/components/select'
import {
  Param,
  Types,
  getDefaultCodeConfiguration,
} from 'lang-code-configuration'
import React, { useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { ProblemType } from '../interfaces'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import { langs } from 'lang-code-configuration/data'

const langs = [
  {
    label: 'Javascript',
    value: 'javascript',
  },
  {
    label: 'Typescript',
    value: 'typescript',
  },
  {
    label: 'Python',
    value: 'python',
  },
  {
    label: 'Java',
    value: 'java',
  },
  {
    label: 'Dart',
    value: 'dart',
  },
  {
    label: 'C++',
    value: 'cpp',
  },
] as Option<string>[]

export default function Editor({ control }: { control: Control<ProblemType> }) {
  const { funcName, params, returnType } = useWatch({
    control,
    name: 'config',
  })

  const [lang, setLang] = useState<Option<string> | undefined>(langs[0])

  return (
    <>
      <div className="rounded-tl-md p-2 bg-dark-layer-2 rounded-tr-md">
        <Select
          isMulti={false}
          enableSearch={false}
          name="Language"
          menuWidth="w-[200px]"
          menuHeight="h-[150px]"
          inlineBtnStyle=""
          options={langs}
          value={lang}
          onChange={(o) => setLang(o)}
          replaceName={true}
        ></Select>
      </div>

      <MonacoEditor
        value={
          lang
            ? getDefaultCodeConfiguration(
                lang.value as langs,
                funcName || 'funcName',
                (returnType?.label as Types) ?? 'String',
                params.map((param) => ({
                  name: param.name,
                  type: (param.type?.label || 'String') as Types,
                })) as Param[]
              )
            : ''
        }
        className="md:h-full h-64 relative md:absolute"
        language={lang?.value}
        theme="vs-dark"
        options={{
          formatOnPaste: false,
          automaticLayout: true,
          readOnly: true,
          padding: {
            top: 15,
          },
        }}
      />
    </>
  )
}
