import React, { useMemo, useState } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import styled from 'styled-components';

export interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const StyleButton = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 20;
    opacity: 0;
    transition: opacity 0.3s;
`;

const StyleEditor = styled.div`
    position: relative;
    height: 100%;

    &:hover ${StyleButton} {
        opacity: 1;
    }
`;

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const [editor, setEditor] = useState<any>(null);

    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        setEditor(monacoEditor);
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });
        monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    };

    const onFormat = () => {
        const unformatted = editor.getModel().getValue();
        const formatted = prettier.format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true
        });
        editor.setValue(formatted);
    };

    const monacoEditor = useMemo(
        () => (
            <MonacoEditor
                value={initialValue}
                editorDidMount={onEditorDidMount}
                theme="vs-dark"
                language="javascript"
                height="500px"
                options={{
                    wordWrap: 'on',
                    folding: false,
                    lineNumbersMinChars: 3,
                    tabSize: 2,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                }}
            />
        ),
        [initialValue, onChange]
    );

    return (
        <StyleEditor>
            <StyleButton>
                <button className="button button-format is-primary is-small" onClick={onFormat}>
                    Format
                </button>
            </StyleButton>
            {monacoEditor}
        </StyleEditor>
    );
};

export default CodeEditor;
