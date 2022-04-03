import React, { useState } from 'react';
import CodeEditor, { CodeEditorProps } from './code-editor';
import Preview from './preview';
import bundler from '../bundler';

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
        <div>
            <CodeEditor {...codeEditorProps} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code} />
        </div>
    );
};

export default CodeCell;
