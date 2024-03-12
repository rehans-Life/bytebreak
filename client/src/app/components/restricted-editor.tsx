import React, { useEffect, useRef, useState } from 'react'
import { editor } from 'monaco-editor'
import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react'

export default function RestrictedEditor({
    value,
    onChange,
    onMount,
    language,
    className,
    options,
    restrictedLines,
}: {
    value: string | undefined,
    onMount?: OnMount,
    onChange: (value?: string) => void,
    restrictedLines: number[],
    options?: editor.IStandaloneEditorConstructionOptions,
    language?: string,
    className?: string,
}) {
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const previousValue = useRef<string[]>(value?.split("\n") || []);

    const [restrictedAreas, setRestrictedAreas] = useState(restrictedLines);

    useEffect(() => {
        if (restrictedAreas === restrictedLines) return;
        setRestrictedAreas(restrictedLines);

    }, [restrictedLines]);

    useEffect(() => {
        previousValue.current = []
    }, [language])

    return (
        <MonacoEditor
            className={className}
            onMount={(editor, monaco) => {
                editorRef.current = editor;
                onMount?.(editor, monaco)
            }}
            theme='vs-dark'
            saveViewState={false}
            options={options}
            value={value}
            language={language}
            onChange={(value, ev) => {
                if (ev.isUndoing) return;

                const { changes: [change] } = ev;
                const newValue = value!.split("\n");

                const changeValue = change.text;
                const changeLine = change.range.startLineNumber

                if (restrictedAreas.some((line) => line === changeLine)) {
                    editorRef.current?.trigger('', 'undo', {})
                    return;
                }

                const isWithinRestricted = restrictedAreas.some((line) => line > changeLine);

                if (isWithinRestricted && changeValue.includes("\n")) {
                    setRestrictedAreas(restrictedAreas.map((line) => line > changeLine ? line + 1 : line))
                }

                if (changeValue === '' && newValue.length < previousValue.current.length) {
                    if (!restrictedAreas.some((line) => line === (changeLine + 1))) {
                        setRestrictedAreas(restrictedAreas.map((line) => line > changeLine ? line - 1 : line))
                    } else {
                        editorRef.current?.trigger('', 'undo', {})
                        return;
                    }
                }

                onChange(value)
                previousValue.current = newValue;
            }}
        />
    )
}
