import React, { useEffect, useRef, useState } from 'react';
import '../libs/text-editor.css';
import MDEditor from '@uiw/react-md-editor';

export interface TextEditorProps {}

const TextEditor: React.FC<TextEditorProps> = () => {
    const [value, setValue] = useState('**Hello world!!!**');
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle click to outside of markdown editor will close editor
        const listener = (event: MouseEvent) => {
            if (editorRef.current && event.target && editorRef.current.contains(event.target as Node)) {
                return;
            }
            setIsEditing(false);
        };
        document.addEventListener('click', listener, { capture: true });
        return () => {
            document.removeEventListener('click', listener, true);
        };
    }, []);

    if (isEditing) {
        return (
            <div className="text-editor" ref={editorRef}>
                <MDEditor value={value} onChange={(val) => setValue(val || '')} />
            </div>
        );
    }

    return (
        <div className="text-editor card" onClick={() => setIsEditing(true)}>
            <div className="card-content">
                <MDEditor.Markdown source={value} />
            </div>
        </div>
    );
};

export default TextEditor;
