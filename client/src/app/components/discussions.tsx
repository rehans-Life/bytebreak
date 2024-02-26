import React, { useState } from 'react'
import MarkdownTextArea from './markdown-textarea'

export default function Discussions() {
    const [comment, setComment] = useState("");

    return (
        <div>
            <MarkdownTextArea
                value={comment}
                onChange={(value) => setComment(value || "")}
            />
        </div>

    )
}
