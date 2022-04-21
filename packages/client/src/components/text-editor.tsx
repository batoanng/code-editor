import React, { useEffect, useRef, useState } from 'react';
import '../libs/text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

export interface TextEditorProps {
    cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const { updateCell } = useActions();

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
                <MDEditor value={cell.content} onChange={(val) => updateCell(cell.id, val || '')} />
            </div>
        );
    }

    return (
        <div className="text-editor card" onClick={() => setIsEditing(true)}>
            <div className="card-content">
                <MDEditor.Markdown source={cell.content} />
            </div>
        </div>
    );
};

export default TextEditor;
