import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState } from 'react'
import { ICommand, commands } from '@uiw/react-md-editor';
import { IoCodeSlashOutline } from "@react-icons/all-files/io5/IoCodeSlashOutline";
import { IoLink } from "@react-icons/all-files/io5/IoLink";
import styles from '../styles';

const code: ICommand = {
    name: 'code',
    keyCommand: 'code',
    buttonProps: { 'aria-label': 'Insert Code Block' },
    icon: (
        <div className='rounded-md hover:bg-dark-fill-2 py-1.5 px-1.5'>
            <IoCodeSlashOutline className="text-dark-gray-6" />
        </div>
    ),
    execute: (state, api) => {
        api.setSelectionRange({ start: 0, end: state.text.length });
        api.replaceSelection(state.text + "`your inline code...your inline code..`");
    },
};

const link: ICommand = {
    name: 'link',
    keyCommand: 'link',
    buttonProps: { 'aria-label': 'Insert Link' },
    icon: (
        <div className='rounded-md hover:bg-dark-fill-2 py-1.5 px-1.5'>
            <IoLink className="text-dark-gray-6" />
        </div>
    ),
    execute: (state, api) => {
        api.setSelectionRange({ start: 0, end: state.text.length });
        api.replaceSelection(state.text + "[title](url)");
    },
};

const tag: ICommand = {
    name: '@',
    keyCommand: '@',
    buttonProps: { 'aria-label': 'Insert Reference' },
    icon: (
        <div className='rounded-md hover:bg-dark-fill-2 py-1.5 px-1.5'>
            <IoLink className="text-dark-gray-6" />
        </div>
    ),
    execute: (state, api) => {
        api.textArea.value = state.text + "``";
    },
};


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

export default function MarkdownTextArea({
    value, onChange
}: { value: string, onChange: (value: string | undefined) => void }) {
    const [showPreview, setShowPreview] = useState(false);

    console.log(commands.codePreview)

    const addComment: ICommand = {
        name: 'Comment',
        keyCommand: 'Comment',
        buttonProps: { 'aria-label': 'Add Comment' },
        value: 'comment',
        execute(state, api, dispatch, executeCommandState, shortcuts) {
            console.log("Send Comment")
        },
        icon: (
            <button>Comment</button>
        )
    }

    const changeView: ICommand = useMemo<ICommand>(() => {
        return Object.assign(showPreview ? commands.codeEdit : commands.codePreview, {
            execute() {
                setShowPreview(!showPreview);
            },
            icon: (
                <button className={`${styles.btn}`}>{showPreview ? "Editor" : "Preview"}</button>
            )
        });
    }, [showPreview]);

    return (
        <MDEditor
            value={value}
            onChange={(value) => {
                onChange(value)
            }}
            preview="edit"
            extraCommands={[changeView, addComment]}
            commands={[
                code, link
            ]}
            toolbarBottom
        />
    )
}
