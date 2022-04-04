import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CodeEditor, { CodeEditorProps } from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import Resizable from './resizable';

const StyleCell = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const CodeCell = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            const compiledCode = await bundler(input);
            setCode(compiledCode);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [input]);

    const codeEditorProps: CodeEditorProps = {
        initialValue: 'const a = 1;',
        onChange: (value) => setInput(value)
    };

    return (
        <Resizable direction="vertical">
            <StyleCell>
                <Resizable direction="horizontal">
                    <CodeEditor {...codeEditorProps} />
                </Resizable>
                <Preview code={code} />
            </StyleCell>
        </Resizable>
    );
};

export default CodeCell;
