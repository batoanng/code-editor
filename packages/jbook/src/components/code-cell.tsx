import React, { useState } from 'react';
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

    const onClick = async () => {
        const compiledCode = await bundler(input);

        setCode(compiledCode);
    };
    const codeEditorProps: CodeEditorProps = {
        initialValue: 'const a = 1;',
        onChange: (value) => setInput(value)
    };

    return (
        <Resizable direct="vertical">
            <StyleCell>
                <Resizable direct="horizontal">
                    <CodeEditor {...codeEditorProps} />
                </Resizable>
                <Preview code={code} />
            </StyleCell>
        </Resizable>
    );
};

export default CodeCell;
