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
        previousValue.current = value?.split("\n") || [];
    }, [language])

    return (
        <MonacoEditor
            className={className}
            onMount={(editor, monaco) => {
                editorRef.current = editor;
                onMount?.(editor, monaco)
            }}
            theme='vs-dark'
            options={options}
            value={value}
            language={language}
            onChange={(value, ev) => {
                if (ev.isUndoing) return;
                
                const { changes: [change] } = ev;
                const newValue = value!.split("\n");
                
                let changeValue = change.text;
                const changeLine = change.range.endLineNumber
                const changeCol = change.range.endColumn;
                const changeLines = changeValue.split("\n").length;

                if (restrictedAreas.some((line) => line === changeLine)) {

                    changeValue = changeValue.replace(/\t/g, '')
                    const leastLine = restrictedAreas.sort((a,b) => a-b)[0];
                    const lineContent = previousValue.current[leastLine - 1] || "";

                    if (changeValue === "\n" && changeLine === leastLine) {

                        if (changeCol === 1) {
                            setRestrictedAreas(restrictedAreas.map((line) => 
                                line >= changeLine ? (line + 1) : line
                            ))
                        } else if (changeCol >= lineContent.length) {
                            setRestrictedAreas(restrictedAreas.map((line) => 
                                line > changeLine ? (line + 1) : line
                            ))
                        }
                    } else if (!changeValue.length && changeCol === 1 && changeLine === leastLine) {
                        setRestrictedAreas(restrictedAreas.map((line) => 
                            line >= changeLine ? (line - 1) : line
                        ))
                    } else {
                        editorRef.current?.trigger('', 'undo', {})
                        return;
                    }
                }

                const isWithinRestricted = !restrictedAreas.some((line) => line === changeLine);

                if (isWithinRestricted && changeValue.includes("\n")) {
                    setRestrictedAreas(restrictedAreas.map((line) => line > changeLine ? line + (changeLines - 1) : line))
                }

                if (changeValue === '' && newValue.length < previousValue.current.length) {
                    if (!restrictedAreas.some((line) => line === (changeLine + 1))) {
                        setRestrictedAreas(restrictedAreas.map((line) => line > changeLine ? line - (change.range.endLineNumber - change.range.startLineNumber) : line))
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